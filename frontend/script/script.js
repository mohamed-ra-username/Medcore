let homePatients, companies, claimsData, approvalsData, phones, appts, invoices;

const api = {
  protocol: "http://",
  subdomain: "",
  domainName: "localhost",
  port: ":5001",
  page: "/api",

  URLlink_with_endpoint: function (endpoint) {
    return this.URLlink + endpoint;
  },

  get URLlink() {
    return `${this.protocol}${this.subdomain}${this.domainName}${this.port}${this.page}`;
  },
};

async function GetDataFromBackend(endpoint) {
  const api_link = api.URLlink_with_endpoint(endpoint);
  console.info("Fetching: ", api_link);
  try {
    const response = await fetch(api_link);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.info(`Error fetching data from ${api_link}: ${error} for endpoint ${endpoint}`);
    return undefined;
  }
}

async function auto_update_data() {
  setTimeout(auto_update_data, 5 * 60 * 1000); // Refresh data every 5 minutes
  try {
    [homePatients,
      companies,
      claimsData,
      approvalsData,
      phones,
      appts,
      invoices,
    ] = await Promise.all([GetDataFromBackend("/homePatients/"),
    GetDataFromBackend("/companies/"),
    GetDataFromBackend("/claims/"),
    GetDataFromBackend("/approvals/"),
    GetDataFromBackend("/phones/"),
    GetDataFromBackend("/appointments/"),
    GetDataFromBackend("/invoices/")]);
  }
  catch (error) {
    console.error("Error fetching data from backend:", error);
  }
  console.info("Data updated from backend.");
}
console.log("Initial Data Fetch...");
auto_update_data(); // Initial data fetch on page load

const role = localStorage.getItem("role");

window.onload = () => {
  applyLang();
  updateAllDashboards();
  renderHome();
};



var lang = localStorage.getItem("lang") ?? "en";
localStorage.setItem("lang", "en");


function update_badge(elementId, value) {
  let badge = document.getElementById(elementId);
  if (!badge) {
    console.error(`Couldn't get element: ${elementId}`);
    return;
  }
  badge.innerHTML = value;
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

async function renderHome() {
  const tb = document.getElementById("home-tbody");
  if (!isValid(homePatients)) {
    homePatients = await GetDataFromBackend("/homePatients/");
  }
  if (!isValid(homePatients)) {
    console.warn("homePatients has not been fetched");
    return;
  }
  if (tb === null) return;

  tb.innerHTML = '';

  homePatients.forEach((p, i) => {
    const tr = document.createElement("tr");
    tr.classList.add("clickable-row");
    tr.onclick = () => viewPatient(i);

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

  // homePatients.map((p, i) => `<tr onclick="viewPatient(${i})" class="clickable-row">
  //   <td><div class="td-name"><div class="mini-avatar">${p.init}</div>${lang === "ar" ? p.arName : p.name}</div></td>
  //   <td>${p.age}</td><td style="color:var(--muted)">${lang === "ar" ? p.arDoc : p.doctor}</td>
  //   <td style="color:var(--muted)">${p.ins}</td><td style="color:var(--muted)">${p.date}</td>
  //   <td><span class="chip chip-${p.status}">${chip(p.status)}</span></td>
  // </tr>`).join("");
}

async function renderCompanies() {
  if (!isValid(companies)) {
    companies = await GetDataFromBackend("/companies/");
  }
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
  const sum = list.map(c => c.amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  total_elemnt.textContent = sum.toLocaleString();
}

async function renderClaims() {
  const tb = document.getElementById("claims-tbody");
  if (!isValid(claimsData)) {
    claimsData = await GetDataFromBackend("/claims/");
  }
  if (!isValid(claimsData)) {
    console.warn("claimsData has not been fetched");
    return;
  }
  const list = claimFilter === "all" ? claimsData : claimsData.filter(c => c.status === claimFilter);
  showTotal(list);
  if (tb === null) return;

  tb.innerHTML = list.map((c, i) => `<tr>
    <td style="font-weight:700;color:var(--blue)">${c.id}</td>
    <td><div class="td-name"><div class="mini-avatar">${initials(c.patient)}</div>${c.patient}</div></td>
    <td style="color:var(--muted)">${c.ins}</td>
    <td style="font-weight:600">${c.amount.toLocaleString()}</td>
    <td style="color:var(--muted)">${c.date}</td>
    <td><span class="chip chip-${c.status}">${chip(c.status)}</span></td>
    <td>${c.status === "pending" ? `<div class="act-btns"><button class="act-approve" onclick="closeClaim(${i},'approved')">${t("approve")}</button><button class="act-reject" onclick="closeClaim(${i},'rejected')">${t("reject")}</button></div>` : `<button class="act-view">${t("view")}</button>`}</td>
  </tr>`).join("");
}

function closeClaim(i, decision) {
  const list = claimFilter === "all" ? claimsData : claimsData.filter(c => c.status === claimFilter);
  const item = list[i];
  const gi = claimsData.indexOf(item);
  if (gi >= 0) claimsData[gi].status = decision;

  updateAllDashboards();
  renderClaims();
}

function filterClaims(f, btn) {
  claimFilter = f;
  document.querySelectorAll("#claims-filter-tabs .ftab").forEach(b => b.classList.remove("on"));
  btn.classList.add("on");
  renderClaims();
}

async function renderApprovals() {
  const tb = document.getElementById("approvals-tbody");
  if (!isValid(approvalsData)) {
    approvalsData = await GetDataFromBackend("/approvals/");
  }
  if (!isValid(approvalsData)) {
    console.warn("approvalsData has not been fetched");
    return;
  }
  approvalRows = approvalsData.map(a => ({ ...a, status: "pending" }));

  const pending = approvalRows.filter(a => a.status === "pending");
  let ap_badge = document.getElementById("approvals-badge");
  if (ap_badge === null) return;
  ap_badge.textContent = pending.length || "0";

  if (!pending.length) {
    tb.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--muted)">✓ ${t("no")} ${t("pending")} ${t("approvals")}</td></tr>`;
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
  const pending = approvalRows.filter(a => a.status === "pending");
  pending[i].status = decision;
  renderApprovals();
}

function approveAll() {
  approvalRows.forEach(a => { if (a.status === "pending") a.status = "approved"; });
  renderApprovals();
}

async function renderPatients() {
  const tb = document.getElementById("pat-tbody");
  if (!isValid(homePatients)) {
    homePatients = await GetDataFromBackend("/homePatients/");
  }
  if (!isValid(phones)) {
    phones = await GetDataFromBackend("/phones/");
  }
  if (!isValid(homePatients)) {
    console.warn("homePatients has not been fetched");
    return;
  }
  if (!isValid(phones)) {
    console.warn("phones has not been fetched");
    return;
  }
  if (tb === null) return;

  tb.innerHTML = homePatients.map((p, i) => `<tr onclick="viewPatient(${i})" class="clickable-row">
    <td><div class="td-name"><div class="mini-avatar">${p.init}</div>${lang === "ar" ? p.arName : p.name}</div></td>
    <td>${p.age}</td><td style="color:var(--muted)">${p.phone || (phones && phones[i]) || "010-0000-0000"}</td>
    <td style="color:var(--muted)">${p.ins}</td><td style="color:var(--muted)">${p.date}</td>
    <td><span class="chip chip-${p.status}">${chip(p.status)}</span></td>
  </tr>`).join("");
}

function savePatient() {
  const name = document.getElementById("inp-patname").value || "New Patient";
  const age = document.getElementById("inp-patage").value || "0";
  const phone = document.getElementById("inp-patphone").value || "";
  const ins = document.getElementById("inp-patins").value;
  const doc = document.getElementById("inp-patdoc").value;

  const today = new Date();
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateStr = `${months[today.getMonth()]} ${today.getDate()}`;

  if (!homePatients) homePatients = [];

  homePatients.unshift({
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
  });

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

function updatePatient() {
  if (currentPatientIndex < 0) return;
  const p = homePatients[currentPatientIndex];

  const newName = document.getElementById("edit-patname").value;
  p.name = newName;
  p.arName = newName;
  p.init = initials(newName);
  p.age = document.getElementById("edit-patage").value;
  p.phone = document.getElementById("edit-patphone").value;
  p.wa = document.getElementById("edit-patwa").value;
  p.nid = document.getElementById("edit-patnid").value;
  p.ins = document.getElementById("edit-patins").value;
  if (p.ins === "None") p.ins = "-";
  p.doctor = document.getElementById("edit-patdoc").value;

  renderHome();
  renderPatients();
  updateAllDashboards();
  closeModal('editPatient');
}

function deletePatient() {
  if (currentPatientIndex < 0) return;
  if (confirm(lang === "ar" ? "هل أنت متأكد من حذف المريض؟" : "Are you sure you want to delete this patient?")) {
    homePatients.splice(currentPatientIndex, 1);
    renderHome();
    renderPatients();
    updateAllDashboards();
    closeModal('editPatient');
  }
}

async function renderAppts() {
  const tb = document.getElementById("appt-tbody");
  if (!isValid(appts)) {
    appts = await GetDataFromBackend("/appointments/");
  }
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
  const tb = document.getElementById("bill-tbody");
  if (!isValid(invoices)) {
    invoices = await GetDataFromBackend("/invoices/");
  }
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
;
;
