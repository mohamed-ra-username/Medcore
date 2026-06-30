import { Utils } from '../core/utils.js';
import { POSTRequest, PUTRequest, DELETERequest } from '../core/api-client.js';
import { Medcore } from './main-script.js';
import { renderPatients } from './rendering.js';
import { syncData } from '../services/sync-service.js';

export function openModal(id) {
  const modal = document.getElementById("modal-" + id);
  if (modal) modal.showModal();
}

export function closeModal(id) {
  const modal = document.getElementById("modal-" + id);
  if (modal) modal.close();
}

export async function saveModalData(modalId) {
  const modal = document.getElementById("modal-" + modalId);
  if (!modal) return;
  const inputs = modal.querySelectorAll("input, select, textarea");
  const data = {};
  inputs.forEach(input => {
    if (input.name) {
      if (input.type === "number") data[input.name] = parseFloat(input.value) || 0;
      else if (input.type === "checkbox") data[input.name] = input.checked;
      else data[input.name] = input.value;
    }
  });

  let endpoint = "";
  let successCallback = null;

  switch (modalId) {
    case 'addPatient':
      endpoint = "/patients/";
      data.init = Utils.initials(data.name || "NP");
      data.status = "active";
      data.date = new Date().toISOString();
      successCallback = () => { syncData(); };
      break;
    case 'addCompany':
      endpoint = "/companies/";
      data.init = Utils.initials(data.name || "CO");
      data.claims = 0;
      data.status = "active";
      successCallback = () => { syncData(); };
      break;
    case 'addClaim':
      endpoint = "/claims/";
      data.status = "pending";
      successCallback = () => { syncData(); };
      break;
    case 'addAppointment':
      endpoint = "/appointments/";
      data.status = "active";
      successCallback = () => { syncData(); };
      break;
    case 'addInvoice':
      endpoint = "/invoices/";
      data.status = "pending";
      successCallback = () => { syncData(); };
      break;
  }

  const result = await POSTRequest(endpoint, data);
  if (result && result.success) {
    if (successCallback) successCallback();
    closeModal(modalId);
  } else {
    alert("Failed to save data: " + (result?.error || "Unknown Error"));
  }
}

export async function updatePatient() {
  const currentId = Medcore.state.currentPatientId;
  if (!currentId) return;
  const modal = document.getElementById("modal-editPatient");
  const inputs = modal.querySelectorAll("input, select, textarea");

  const original = Medcore.state.patients.find(p => p.id === currentId);
  if (!original) return;

  const p = { ...original };
  inputs.forEach(input => {
    if (input.name) {
      if (input.type === "number")
        p[input.name] = parseInt(input.value) || 0;
      else
        p[input.name] = input.value;
    }
  });
  p.init = Utils.initials(p.name);
  const result = await PUTRequest(`/patients/${currentId}/`, p);
  if (result && result.success) {
    const idx = Medcore.state.patients.findIndex(item => item.id === currentId);
    if (idx !== -1) {
      const updated = [...Medcore.state.patients];
      updated[idx] = p;
      Medcore.state.patients = updated;
    }
    closeModal('editPatient');
  } else {
    alert("Failed to update patient.");
  }
}

export async function deletePatient() {
  const currentId = Medcore.state.currentPatientId;
  if (!currentId) return;
  const confirmMsg = Utils.lang === "ar" ? "هل أنت متأكد من حذف المريض؟" : "Are you sure you want to delete this patient?";
  if (confirm(confirmMsg)) {
    const result = await DELETERequest(`/patients/${currentId}/`);
    if (result && result.success) {
      const updated = Medcore.state.patients.filter(item => item.id !== currentId);
      Medcore.state.patients = updated;
      closeModal('editPatient');
      syncData(); // Re-sync stats and claims too
    } else {
      alert("Failed to delete patient.");
    }
  }
}
