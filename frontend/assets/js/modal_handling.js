
function openModal(id) {
  const modal = document.getElementById("modal-" + id);
  if (!modal) return;
  modal.classList.add("show");
  // Reset form inputs (unless it's the edit modal which is populated by viewPatient)
  if (!id.includes('edit')) {
    const inputs = modal.querySelectorAll("input, select, textarea");
    inputs.forEach(input => {
      if (input.type === "checkbox" || input.type === "radio") input.checked = false;
      else input.value = "";
    });
  }
}

function closeModal(id) {
  const modal = document.getElementById("modal-" + id);
  if (modal) modal.classList.remove("show");
}

document.querySelectorAll(".modal-bg").forEach(m => m.addEventListener("click", e => { if (e.target === m) m.classList.remove("show"); }));

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

  console.log(`Submitting data for ${modalId}:`, data);

  let endpoint = "";
  let successCallback = null;

  switch (modalId) {
    case 'addPatient':
      endpoint = "/homePatients/";
      data.init = initials(data.name || "NP");
      data.status = "active";
      const today = new Date();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      data.date = `${months[today.getMonth()]} ${today.getDate()}`;
      successCallback = (res) => {
        homePatients.unshift(res.data);
        renderHome();
        renderPatients();
      };
      break;
    case 'addCompany':
      endpoint = "/companies/";
      data.init = initials(data.name || "CO");
      data.claims = 0;
      data.status = "active";
      successCallback = (res) => {
        companies.push(res.data);
        renderCompanies();
      };
      break;
    case 'addClaim':
      endpoint = "/claims/";
      data.status = "pending";
      successCallback = (res) => {
        claimsData.unshift(res.data);
        renderClaims();
      };
      break;
    case 'addAppointment':
      endpoint = "/appointments/";
      data.status = "active";
      successCallback = (res) => {
        appts.push(res.data);
        renderAppts();
      };
      break;
    case 'addInvoice':
      endpoint = "/invoices/";
      data.status = "pending";
      successCallback = (res) => {
        invoices.unshift(res.data);
        renderBilling();
      };
      break;
    default:
      console.error("Unknown modal ID:", modalId);
      return;
  }

  const result = await SendDataToBackend(endpoint, "POST", data);
  if (result) {
    if (successCallback) successCallback(result);
    updateAllDashboards();
    closeModal(modalId);
  } else {
    alert("Failed to save data. Please try again.");
  }
}

async function updatePatient() {
  if (typeof currentPatientIndex === 'undefined' || currentPatientIndex < 0) return;
  const modal = document.getElementById("modal-editPatient");
  const inputs = modal.querySelectorAll("input, select, textarea");
  const p = { ...homePatients[currentPatientIndex] };

  inputs.forEach(input => {
    if (input.name) {
      if (input.type === "number") p[input.name] = parseInt(input.value) || 0;
      else p[input.name] = input.value;
    }
  });

  p.init = initials(p.name);

  const result = await SendDataToBackend(`/homePatients/${currentPatientIndex}/`, "PUT", p);
  if (result) {
    homePatients[currentPatientIndex] = p;
    renderHome();
    renderPatients();
    updateAllDashboards();
    closeModal('editPatient');
  } else {
    alert("Failed to update patient.");
  }
}

async function deletePatient() {
  if (typeof currentPatientIndex === 'undefined' || currentPatientIndex < 0) return;
  const confirmMsg = lang === "ar" ? "هل أنت متأكد من حذف المريض؟" : "Are you sure you want to delete this patient?";
  if (confirm(confirmMsg)) {
    const result = await SendDataToBackend(`/homePatients/${currentPatientIndex}/`, "DELETE");
    if (result) {
      homePatients.splice(currentPatientIndex, 1);
      renderHome();
      renderPatients();
      updateAllDashboards();
      closeModal('editPatient');
    } else {
      alert("Failed to delete patient.");
    }
  }
}
