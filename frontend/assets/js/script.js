const role = localStorage.getItem("role");

window.onload = () => {
  applyLang();
  setupSearch();
};

function setupSearch() {
  const patientSearch = document.getElementById("home-search");
  if (patientSearch) {
    patientSearch.addEventListener("input", (e) => {
      renderHome(e.target.value.toLowerCase());
    });
  }

  const claimsSearch = document.getElementById("claims-search");
  if (claimsSearch) {
    claimsSearch.addEventListener("input", (e) => {
      renderClaims(e.target.value.toLowerCase());
    });
  }
}

var lang = localStorage.getItem("lang") ?? "en";
localStorage.setItem("lang", lang);

function update_badge(elementId, value) {
  let badge = document.getElementById(elementId);
  if (!badge) {
    console.error(`Couldn't get element: ${elementId}`);
    return;
  }
  badge.innerHTML = value;
}

async function updateAllDashboards() {
  await window.dataLoaded;
  if (!stats) return;

  // Home Dashboard
  if (document.getElementById("stat-patients")) document.getElementById("stat-patients").textContent = stats.home.patients.toLocaleString();
  if (document.getElementById("stat-appts")) document.getElementById("stat-appts").textContent = stats.home.appts.toLocaleString();
  if (document.getElementById("stat-claims")) document.getElementById("stat-claims").textContent = stats.home.claims.toLocaleString();
  if (document.getElementById("stat-revenue")) document.getElementById("stat-revenue").textContent = stats.home.revenue.toLocaleString();

  // Insurance Page
  if (document.getElementById("sb-total-val")) document.getElementById("sb-total-val").textContent = stats.insurance.total;
  if (document.getElementById("sb-active-val")) document.getElementById("sb-active-val").textContent = stats.insurance.active;
  if (document.getElementById("sb-expiring-val")) document.getElementById("sb-expiring-val").textContent = stats.insurance.expiring;
  if (document.getElementById("sb-claims-total-val")) document.getElementById("sb-claims-total-val").textContent = stats.insurance.claims;

  // Claims Page
  if (document.getElementById("c-pending-val")) document.getElementById("c-pending-val").textContent = stats.claims.pending;
  if (document.getElementById("c-approved-val")) document.getElementById("c-approved-val").textContent = stats.claims.approved;
  if (document.getElementById("c-rejected-val")) document.getElementById("c-rejected-val").textContent = stats.claims.rejected;
  if (document.getElementById("c-amount-val")) document.getElementById("c-amount-val").textContent = stats.claims.total_amount.toLocaleString();

  // Billing Page
  if (document.getElementById("bill-total-revenue")) document.getElementById("bill-total-revenue").textContent = stats.billing.total.toLocaleString();
  if (document.getElementById("bill-collected")) document.getElementById("bill-collected").textContent = stats.billing.collected.toLocaleString();
  if (document.getElementById("bill-ins-due")) document.getElementById("bill-ins-due").textContent = stats.billing.ins_due.toLocaleString();
  if (document.getElementById("bill-overdue")) document.getElementById("bill-overdue").textContent = stats.billing.overdue.toLocaleString();

  // Sidebar Badges
  update_badge("patients-badge", stats.home.patients);
  update_badge("appointments-badge", stats.home.appts);
  update_badge("claims-badge", stats.claims.pending);
  update_badge("approvals-badge", stats.insurance.pending); 
}


let claimFilter = "all", companyFilter = "all";

function goPage(id, btn) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
  document.getElementById("page-" + id).classList.add("active");
  btn.classList.add("active");
  if (id === "insurance") renderCompanies();
  if (id === "claims") renderClaims();
  if (id === "approvals") renderApprovals();
  if (id === "patients") renderPatients();
  if (id === "appointments") renderAppts();
  if (id === "billing") renderBilling();
}

function initials(name) { return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(); }
function isValid(variable) { return !(variable === null || variable === undefined); }

async function renderHome(filter = "") {
  await window.dataLoaded;
  const tb = document.getElementById("home-tbody");
  if (!isValid(homePatients)) {
    console.warn("homePatients has not been fetched");
    return;
  }
  if (tb === null) return;

  tb.innerHTML = '';

  const list = filter 
    ? homePatients.filter(p => 
        p.name.toLowerCase().includes(filter) || 
        (p.arName && p.arName.toLowerCase().includes(filter))
      )
    : homePatients;

  list.forEach((p) => {
    const originalIndex = homePatients.indexOf(p);
    const tr = document.createElement("tr");
    tr.classList.add("clickable-row");
    tr.onclick = () => viewPatient(originalIndex);

    const tdName = document.createElement("td");
    tdName.innerHTML = `<div class="td-name"><div class="mini-avatar">${p.init}</div>${lang === "ar" ? p.arName : p.name}</div>`;
    tr.appendChild(tdName);

    const tdAge = document.createElement("td");
    tdAge.textContent = p.age;
    tr.appendChild(tdAge);

    const tdDoctor = document.createElement("td");
    tdDoctor.style.color = "var(--muted)";
    tdDoctor.textContent = lang === "ar" ? p.arDoc : p.doctor;
    tr.appendChild(tdDoctor);

    const tdInsurance = document.createElement("td");
    tdInsurance.style.color = "var(--muted)";
    tdInsurance.textContent = p.ins;
    tr.appendChild(tdInsurance);

    const tdDate = document.createElement("td");
    tdDate.style.color = "var(--muted)";
    tdDate.textContent = p.date;
    tr.appendChild(tdDate);

    const tdStatus = document.createElement("td");
    tdStatus.innerHTML = `<span class="chip chip-${p.status}">${chip(p.status)}</span>`;
    tr.appendChild(tdStatus);

    tb.appendChild(tr);
  });
}

async function renderCompanies() {
  await window.dataLoaded;
  if (!isValid(companies)) {
    console.warn("companies has not been fetched");
    return;
  }
  const grid = document.getElementById("company-grid");
  const list = companyFilter === "all" ? companies : companies.filter(c => c.status === companyFilter);
  if (grid === null) return;
  grid.innerHTML = list.map(c => `
    <div class="company-card">
      <div class="cc-header">
        <div class="cc-logo" style="background:${c.color}">${c.init}</div>
        <div style="flex:1"><div class="cc-name">${c.name}</div><div class="cc-type">${c.type}</div></div>
        <span class="chip ${c.status === "expiring" ? "chip-expiring" : "chip-active"}">${chip(c.status)}</span>
      </div>
      <div class="cc-row">
        <div class="cc-kpi"><div class="cc-kpi-val">${c.claims}</div><div class="cc-kpi-lbl">${t("claims")}</div></div>
        <div class="cc-kpi"><div class="cc-kpi-val">${c.limit}</div><div class="cc-kpi-lbl">${t("limit")}</div></div>
        <div class="cc-kpi"><div class="cc-kpi-val" style="color:${c.status === "expiring" ? "#E65100" : "var(--teal)"}">${c.end}</div><div class="cc-kpi-lbl">${t("expires")}</div></div>
      </div>
    </div>`).join("");
}

function filterCompanies(f, btn) {
  companyFilter = f;
  document.querySelectorAll("#page-insurance .ftab").forEach(b => b.classList.remove("on"));
  btn.classList.add("on");
  renderCompanies();
}

function showTotal(list) {
  const total_elemnt = document.getElementById("claims-total-sum");
  if (!total_elemnt) return;
  const sum = list.map(c => c.amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  total_elemnt.textContent = sum.toLocaleString();
}

async function renderClaims(filter = "") {
  await window.dataLoaded;
  const tb = document.getElementById("claims-tbody");
  if (!isValid(claimsData)) {
    console.warn("claimsData has not been fetched");
    return;
  }
  let list = claimFilter === "all" ? claimsData : claimsData.filter(c => c.status === claimFilter);
  
  if (filter) {
    list = list.filter(c => 
      c.id.toLowerCase().includes(filter) || 
      c.patient.toLowerCase().includes(filter) ||
      c.ins.toLowerCase().includes(filter)
    );
  }

  showTotal(list);
  if (tb === null) return;

  tb.innerHTML = list.map((c) => {
    const originalIndex = claimsData.indexOf(c);
    return `<tr>
    <td style="font-weight:700;color:var(--blue)">${c.id}</td>
    <td><div class="td-name"><div class="mini-avatar">${initials(c.patient)}</div>${c.patient}</div></td>
    <td style="color:var(--muted)">${c.ins}</td>
    <td style="font-weight:600">${c.amount.toLocaleString()}</td>
    <td style="color:var(--muted)">${c.date}</td>
    <td><span class="chip chip-${c.status}">${chip(c.status)}</span></td>
    <td>${c.status === "pending" ? `<div class="act-btns"><button class="act-approve" onclick="closeClaim(${originalIndex},'approved')">${t("approve")}</button><button class="act-reject" onclick="closeClaim(${originalIndex},'rejected')">${t("reject")}</button></div>` : `<button class="act-view">${t("view")}</button>`}</td>
  </tr>`}).join("");
}

async function closeClaim(gi, decision) {
  if (gi >= 0) {
    const result = await SendDataToBackend(`/claims/${gi}/status/`, 'PUT', { status: decision });
    if (result) {
        claimsData[gi].status = decision;
        updateAllDashboards();
        renderClaims();
    }
  }
}

function filterClaims(f, btn) {
  claimFilter = f;
  document.querySelectorAll("#claims-filter-tabs .ftab").forEach(b => b.classList.remove("on"));
  btn.classList.add("on");
  renderClaims();
}

async function renderApprovals() {
  await window.dataLoaded;
  const tb = document.getElementById("approvals-tbody");
  if (!isValid(approvalsData)) {
    console.warn("approvalsData has not been fetched");
    return;
  }
  approvalRows = approvalsData.map(a => ({ ...a })); // Clone data

  const pending = approvalRows.filter(a => a.status === "pending" || a.status === "active"); // Adjust based on your status enums
  let ap_badge = document.getElementById("approvals-badge");
  if (ap_badge) ap_badge.textContent = pending.length || "0";

  if (!pending.length) {
    if (tb) tb.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--muted)">✓ ${t("noPending")}</td></tr>`;
    return;
  }

  if (tb === null) return;
  tb.innerHTML = pending.map((a, i) => `<tr>
    <td style="font-weight:700;color:var(--blue)">${a.ref}</td>
    <td><div class="td-name"><div class="mini-avatar">${initials(a.patient)}</div>${a.patient}</div></td>
    <td>${a.proc}</td><td style="color:var(--muted)">${a.ins}</td>
    <td style="color:var(--muted)">${a.date}</td>
    <td style="font-weight:600">${a.amount.toLocaleString()}</td>
    <td><div class="act-btns"><button class="act-approve" onclick="decideApproval(${i},'approved')">${t("approve")}</button><button class="act-reject" onclick="decideApproval(${i},'rejected')">${t("reject")}</button></div></td>
  </tr>`).join("");
}

function decideApproval(i, decision) {
  // Logic to update approval status locally
  const pending = approvalRows.filter(a => a.status === "pending" || a.status === "active");
  if (pending[i]) pending[i].status = decision;
  renderApprovals();
}

function approveAll() {
  approvalRows.forEach(a => { if (a.status === "pending" || a.status === "active") a.status = "approved"; });
  renderApprovals();
}

async function renderPatients() {
  await window.dataLoaded;
  const tb = document.getElementById("pat-tbody");
  if (!isValid(homePatients)) {
    console.warn("homePatients has not been fetched");
    return;
  }
  if (tb === null) return;

  tb.innerHTML = homePatients.map((p) => {
    const originalIndex = homePatients.indexOf(p);
    return `<tr onclick="viewPatient(${originalIndex})" class="clickable-row">
    <td><div class="td-name"><div class="mini-avatar">${p.init}</div>${lang === "ar" ? p.arName : p.name}</div></td>
    <td>${p.age}</td><td style="color:var(--muted)">${p.phone || (phones && phones[originalIndex]) || "010-0000-0000"}</td>
    <td style="color:var(--muted)">${p.ins}</td><td style="color:var(--muted)">${p.date}</td>
    <td><span class="chip chip-${p.status}">${chip(p.status)}</span></td>
  </tr>`}).join("");
}

async function savePatient() {
  const name = document.getElementById("inp-patname").value || "New Patient";
  const age = document.getElementById("inp-patage").value || "0";
  const phone = document.getElementById("inp-patphone").value || "";
  const ins = document.getElementById("inp-patins").value;
  const doc = document.getElementById("inp-patdoc").value;

  const today = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateStr = `${months[today.getMonth()]} ${today.getDate()}`;

  const newPatient = {
    name: name,
    arName: name,
    init: initials(name),
    age: parseInt(age),
    doctor: doc,
    arDoc: doc,
    ins: ins === "None" ? "-" : ins,
    date: dateStr,
    status: "active",
    phone: phone
  };

  const result = await SendDataToBackend("/homePatients/", "POST", newPatient);
  if (result) {
    homePatients.unshift(newPatient);
    renderHome();
    renderPatients();
    updateAllDashboards();

    document.getElementById("inp-patname").value = "";
    document.getElementById("inp-patage").value = "";
    document.getElementById("inp-patphone").value = "";
    document.getElementById("inp-patwa").value = "";
    document.getElementById("inp-patnid").value = "";

    closeModal('addPatient');
  }
}

let currentPatientIndex = -1;

function viewPatient(index) {
  currentPatientIndex = index;
  const p = homePatients[index];
  document.getElementById("edit-patname").value = lang === "ar" ? (p.arName || p.name) : p.name;
  document.getElementById("edit-patage").value = p.age;
  document.getElementById("edit-patphone").value = p.phone || (phones && phones[index]) || "";
  document.getElementById("edit-patwa").value = p.wa || "";
  document.getElementById("edit-patnid").value = p.nid || "";

  const insSelect = document.getElementById("edit-patins");
  if (Array.from(insSelect.options).some(o => o.value === p.ins)) insSelect.value = p.ins; else insSelect.value = "None";

  const docSelect = document.getElementById("edit-patdoc");
  if (Array.from(docSelect.options).some(o => o.value === p.doctor)) docSelect.value = p.doctor; else docSelect.selectedIndex = 0;

  const inputs = document.querySelectorAll("#modal-editPatient input, #modal-editPatient select");
  inputs.forEach(i => i.disabled = true);

  document.getElementById("m-esave").style.display = "none";
  document.getElementById("m-eedit").style.display = "inline-block";

  openModal("editPatient");
}

function toggleEditPatient() {
  const inputs = document.querySelectorAll("#modal-editPatient input, #modal-editPatient select");
  inputs.forEach(i => i.disabled = false);
  document.getElementById("m-esave").style.display = "inline-block";
  document.getElementById("m-eedit").style.display = "none";
}

async function updatePatient() {
  if (currentPatientIndex < 0) return;
  const p = { ...homePatients[currentPatientIndex] };

  const newName = document.getElementById("edit-patname").value;
  p.name = newName;
  p.arName = newName;
  p.init = initials(newName);
  p.age = parseInt(document.getElementById("edit-patage").value);
  p.phone = document.getElementById("edit-patphone").value;
  p.wa = document.getElementById("edit-patwa").value;
  p.nid = document.getElementById("edit-patnid").value;
  p.ins = document.getElementById("edit-patins").value;
  if (p.ins === "None") p.ins = "-";
  p.doctor = document.getElementById("edit-patdoc").value;

  const result = await SendDataToBackend(`/homePatients/${currentPatientIndex}/`, "PUT", p);
  if (result) {
    homePatients[currentPatientIndex] = p;
    renderHome();
    renderPatients();
    updateAllDashboards();
    closeModal('editPatient');
  }
}

async function deletePatient() {
  if (currentPatientIndex < 0) return;
  if (confirm(lang === "ar" ? "هل أنت متأكد من حذف المريض؟" : "Are you sure you want to delete this patient?")) {
    const result = await SendDataToBackend(`/homePatients/${currentPatientIndex}/`, "DELETE");
    if (result) {
      homePatients.splice(currentPatientIndex, 1);
      renderHome();
      renderPatients();
      updateAllDashboards();
      closeModal('editPatient');
    }
  }
}

async function renderAppts() {
  await window.dataLoaded;
  const tb = document.getElementById("appt-tbody");
  if (!isValid(appts)) {
    console.warn("appts has not been fetched");
    return;
  }
  if (tb === null) return;


  tb.innerHTML = appts.map(a => `<tr>
    <td style="font-weight:700">${a.time}</td><td>${a.patient}</td>
    <td style="color:var(--muted)">${a.doctor}</td><td>${a.type}</td>
    <td><span class="chip chip-${a.status}">${chip(a.status)}</span></td>
  </tr>`).join("");
}

async function renderBilling() {
  await window.dataLoaded;
  const tb = document.getElementById("bill-tbody");
  if (!isValid(invoices)) {
    console.warn("invoices has not been fetched");
    return;
  }
  if (tb === null) return;


  tb.innerHTML = invoices.map(v => `<tr>
    <td style="font-weight:700;color:var(--blue)">${v.id}</td><td>${v.patient}</td>
    <td style="color:var(--muted)">${v.date}</td><td style="font-weight:600">${v.amount.toLocaleString()}</td>
    <td style="color:var(--muted)">${v.ins}</td>
    <td><span class="chip chip-${v.status}">${chip(v.status)}</span></td>
  </tr>`).join("");
}

function openModal(id) { document.getElementById("modal-" + id).classList.add("show"); }
function closeModal(id) { document.getElementById("modal-" + id).classList.remove("show"); }
document.querySelectorAll(".modal-bg").forEach(m => m.addEventListener("click", e => { if (e.target === m) m.classList.remove("show"); }));
