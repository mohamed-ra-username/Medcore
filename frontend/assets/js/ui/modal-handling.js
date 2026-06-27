
function openModal(id) {
  const modal = document.getElementById("modal-" + id);
  modal.showModal()
  //! Deprecated found better method
  // const modal = document.getElementById("modal-" + id);
  // if (!modal) return;
  // modal.classList.add("show");
  // if (!id.includes('edit')) {
  //   const inputs = modal.querySelectorAll("input, select, textarea");
  //   inputs.forEach(input => {
  //     if (input.type === "checkbox" || input.type === "radio") input.checked = false;
  //     else input.value = "";
  //   });
  // }
}

function closeModal(id) {
  const modal = document.getElementById("modal-" + id);
  modal.close()
  // if (modal) modal.classList.remove("show");
}

// document.querySelectorAll(".modal-bg").forEach(m => m.addEventListener("click", e => { if (e.target === m) m.classList.remove("show"); }));

async function saveModalData(modalId) {
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
      endpoint = "/homePatients/";
      data.init = Utils.initials(data.name || "NP");
      data.status = "active";
      data.date = new Date().toISOString();
      successCallback = (res) => { homePatients.unshift(res.data); renderHome(); renderPatients(); };
      break;
    case 'addCompany':
      endpoint = "/companies/";
      data.init = Utils.initials(data.name || "CO");
      data.claims = 0;
      data.status = "active";
      successCallback = (res) => { companies.push(res.data); renderCompanies(); };
      break;
    case 'addClaim':
      endpoint = "/claims/";
      data.status = "pending";
      successCallback = (res) => { claimsData.unshift(res.data); renderClaims(); };
      break;
    case 'addAppointment':
      endpoint = "/appointments/";
      data.status = "active";
      successCallback = (res) => { appts.push(res.data); renderAppts(); };
      break;
    case 'addInvoice':
      endpoint = "/invoices/";
      data.status = "pending";
      successCallback = (res) => { invoices.unshift(res.data); renderBilling(); };
      break;
  }

  const result = await POSTRequest(endpoint, data);
  if (result && result.success) {
    if (successCallback) successCallback(result);
    closeModal(modalId);
  } else {
    alert("Failed to save data: " + (result?.error || "Unknown Error"));
  }
}

async function updatePatient() {
  if (!currentPatientId) return;
  const modal = document.getElementById("modal-editPatient");
  const inputs = modal.querySelectorAll("input, select, textarea");

  const original = Medcore.state.patients.find(p => p.id === currentPatientId);
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
  const result = await PUTRequest(`/homePatients/${currentPatientId}/`, p);
  if (result && result.success) {
    const idx = Medcore.state.patients.findIndex(item => item.id === currentPatientId);
    if (idx !== -1) Medcore.state.patients[idx] = p;
    // broadcast('medcore:patients_updated', homePatients);
    renderPatients(Medcore.state.patients);
    // renderHome();
    closeModal('editPatient');
  } else {
    alert("Failed to update patient.");
  }
}

async function deletePatient() {
  if (!currentPatientId) return;
  const confirmMsg = Utils.lang === "ar" ? "هل أنت متأكد من حذف المريض؟" : "Are you sure you want to delete this patient?";
  if (confirm(confirmMsg)) {
    const result = await DELETERequest(`/homePatients/${currentPatientId}/`);
    if (result && result.success) {
      const idx = Medcore.state.patients.findIndex(item => item.id === currentPatientId);
      if (idx !== -1) Medcore.state.patients.splice(idx, 1);
      renderHome();
      renderPatients(Medcore.state.patients);
      closeModal('editPatient');
    } else {
      alert("Failed to delete patient.");
    }
  }
}

