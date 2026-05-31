const role = localStorage.getItem("role");

api = {
  protocol: "http://",
  subdomain: "",
  domainName: "localhost",
  port: ":5001",
  page: "/api",

  URLlink_with_endpoint: function (endpoint) {
    return this.URLlink + endpoint
  },

  get URLlink() {
    return `${this.protocol}${this.subdomain}${this.domainName}${this.port}${this.page}`;
  },
}

window.onload = () => {
  applyLang();
  display_sidebar_badges();
  display_dashboard();
}

let lang = localStorage.getItem("lang")
if (lang === null) {
  lang = "en"
  localStorage.setItem("lang", "en")
}

var companies, claimsData, approvalsData, invoices, phones, homePatients, appts, approvalRows
// const companies = [
//   { name: "Misr Insurance", type: "National", color: "#1B4F8A", init: "MI", claims: 87, limit: "500,000", end: "Dec 2026", status: "active" },
//   { name: "AXA Egypt", type: "International", color: "#1AAB8A", init: "AX", claims: 64, limit: "750,000", end: "Aug 2026", status: "expiring" },
//   { name: "MetLife Egypt", type: "Private", color: "#7B1FA2", init: "ML", claims: 41, limit: "400,000", end: "May 2027", status: "active" },
//   { name: "Allianz Egypt", type: "International", color: "#E65100", init: "AL", claims: 53, limit: "600,000", end: "Jan 2027", status: "active" },
//   { name: "GlobeMed", type: "International", color: "#0277BD", init: "GM", claims: 38, limit: "350,000", end: "Jul 2026", status: "expiring" },
//   { name: "Egypt Insurance", type: "National", color: "#2E7D32", init: "EI", claims: 29, limit: "300,000", end: "Apr 2027", status: "active" },
//   { name: "Solidarity Egypt", type: "National", color: "#AD1457", init: "SO", claims: 18, limit: "250,000", end: "Sep 2026", status: "active" },
//   { name: "Wataniya Insurance", type: "National", color: "#4527A0", init: "WI", claims: 12, limit: "200,000", end: "Nov 2027", status: "active" },
// ];
// const claimsData = [
//   { id: "CLM-2405", patient: "Ahmed Hassan", ins: "Misr Insurance", amount: 3200, date: "May 4", status: "pending" },
//   { id: "CLM-2404", patient: "Sara Khalil", ins: "AXA Egypt", amount: 1800, date: "May 4", status: "approved" },
//   { id: "CLM-2403", patient: "Mohamed Ali", ins: "MetLife Egypt", amount: 5600, date: "May 3", status: "pending" },
//   { id: "CLM-2402", patient: "Laila Omar", ins: "Allianz Egypt", amount: 2100, date: "May 3", status: "approved" },
//   { id: "CLM-2401", patient: "Youssef Adel", ins: "GlobeMed", amount: 4300, date: "May 2", status: "rejected" },
//   { id: "CLM-2400", patient: "Nour Ibrahim", ins: "Misr Insurance", amount: 900, date: "May 2", status: "approved" },
//   { id: "CLM-2399", patient: "Khaled Samir", ins: "Egypt Insurance", amount: 7200, date: "May 1", status: "pending" },
//   { id: "CLM-2398", patient: "Dina Mostafa", ins: "Solidarity", amount: 1500, date: "Apr 30", status: "pending" },
// ];
// const approvalsData = [
//   { ref: "AUTH-881", patient: "Ahmed Hassan", proc: "MRI Brain", ins: "Misr Insurance", date: "May 4", amount: 4800 },
//   { ref: "AUTH-880", patient: "Sara Khalil", proc: "Knee Surgery", ins: "AXA Egypt", date: "May 3", amount: 18500 },
//   { ref: "AUTH-879", patient: "Mohamed Ali", proc: "Chemotherapy", ins: "MetLife Egypt", date: "May 3", amount: 12000 },
//   { ref: "AUTH-878", patient: "Laila Omar", proc: "Echo Cardiogram", ins: "Allianz Egypt", date: "May 2", amount: 2200 },
//   { ref: "AUTH-877", patient: "Youssef Adel", proc: "Hip Replacement", ins: "GlobeMed", date: "May 2", amount: 32000 },
// ];
// const homePatients = [
//   { name: "Ahmed Hassan", arName: "أحمد حسن", init: "AH", age: 42, doctor: "Dr. Nour", arDoc: "د. نور", ins: "Misr Insurance", date: "May 4", status: "active" },
//   { name: "Sara Khalil", arName: "سارة خليل", init: "SK", age: 29, doctor: "Dr. Mostafa", arDoc: "د. مصطفى", ins: "AXA Egypt", date: "May 4", status: "done" },
//   { name: "Mohamed Ali", arName: "محمد علي", init: "MA", age: 55, doctor: "Dr. Nour", arDoc: "د. نور", ins: "MetLife Egypt", date: "May 3", status: "pending" },
//   { name: "Laila Omar", arName: "ليلى عمر", init: "LO", age: 38, doctor: "Dr. Sara", arDoc: "د. سارة", ins: "Allianz Egypt", date: "May 3", status: "active" },
//   { name: "Youssef Adel", arName: "يوسف عادل", init: "YA", age: 61, doctor: "Dr. Mostafa", arDoc: "د. مصطفى", ins: "GlobeMed", date: "May 2", status: "done" },
// ];
// const appts = [
//     { time: "08:30", patient: "Ahmed Hassan", doctor: "Dr. Nour", type: "Consultation", status: "done" },
//     { time: "09:00", patient: "Sara Khalil", doctor: "Dr. Mostafa", type: "Follow-up", status: "done" },
//     { time: "10:15", patient: "Mohamed Ali", doctor: "Dr. Nour", type: "Surgery Prep", status: "active" },
//     { time: "11:00", patient: "Laila Omar", doctor: "Dr. Sara", type: "Radiology", status: "active" },
//     { time: "12:30", patient: "Youssef Adel", doctor: "Dr. Mostafa", type: "Consultation", status: "pending" },
//   ];
// const phones = ["010-1234-5678", "012-9876-5432", "011-5555-1234", "010-8888-7777", "012-3333-2222"];
// const invoices = [
//     { id: "INV-1042", patient: "Ahmed Hassan", date: "May 4", amount: "3,200", ins: "Misr Insurance", status: "pending" },
//     { id: "INV-1041", patient: "Sara Khalil", date: "May 4", amount: "1,800", ins: "AXA Egypt", status: "done" },
//     { id: "INV-1040", patient: "Mohamed Ali", date: "May 3", amount: "5,600", ins: "MetLife Egypt", status: "pending" },
//     { id: "INV-1039", patient: "Laila Omar", date: "May 3", amount: "2,100", ins: "Allianz Egypt", status: "done" },
//     { id: "INV-1038", patient: "Youssef", date: "May 2", amount: "4,300", ins: "GlobeMed", status: "rejected" },
//   ];
// const phones = ["010-1234-5678", "012-9876-5432", "011-5555-1234", "010-8888-7777", "012-3333-2222"];

function update_badge(elementId, value) {
  badge = document.getElementById(elementId);
  if (!badge) {
    console.error(`Couldn't get element: ${elementId}`)
  }
  badge.innerHTML = value
}

async function GetDataFromBackend(endpoint) {
  const api_link = api.URLlink_with_endpoint(endpoint)
  console.info(api_link)
  try {
    const response = await fetch(api_link);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data
  }
  catch (error) {
    console.info(`Error fetching data from ${api_link}: ${error} for endpoint ${endpoint}`);
    return undefined
  };

  // try {
  // const response = await fetch(api.api_temp + endpoint);

  //   if (!response.ok) {
  //     throw new Error('Network response was not ok');
  //   }

  //   var data = await response.json();
  //   return data

  // } catch (error) {
  //   console.info('Error fetching data:', error, "for endpoint:", endpoint);
  //   return undefined;
  // }
}



let claimFilter = "all", companyFilter = "all";

function d() { return T[lang] }
function chip(k) { return d().chips[k] || k }
function t(k) { return d()[k] || k }

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

function applyLang() {
  const dd = d();
  document.documentElement.setAttribute("dir", dd.dir);
  document.documentElement.setAttribute("lang", lang);
  Object.keys(dd).forEach(k => {
    if (typeof dd[k] === "string") { const el = document.getElementById(k); if (el) el.textContent = dd[k]; }
  });
  // FIXME useless render
  // renderHome(); renderCompanies(); renderClaims(); renderApprovals(); renderPatients(); renderAppts(); renderBilling();
}
function toggleLang() {
  lang = lang === "en" ? "ar" : "en"; applyLang();
  localStorage.setItem("lang", lang)
}

function initials(name) { return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() }
function isValid(variable) { return !((variable === null) | (variable === undefined)) }
async function renderHome() {
  const tb = document.getElementById("home-tbody");
  homePatients = await GetDataFromBackend("/homePatients/")
  if (!isValid(homePatients)) {
    console.warn("homePatients has not been fetched")
    return;
  }
  if ((tb === null) | (homePatients === null)) { return }
  tb.innerHTML = homePatients.map((p, i) => `<tr onclick="viewPatient(${i})" class="clickable-row">
    <td><div class="td-name"><div class="mini-avatar">${p.init}</div>${lang === "ar" ? p.arName : p.name}</div></td>
    <td>${p.age}</td><td style="color:var(--muted)">${lang === "ar" ? p.arDoc : p.doctor}</td>
    <td style="color:var(--muted)">${p.ins}</td><td style="color:var(--muted)">${p.date}</td>
    <td><span class="chip chip-${p.status}">${chip(p.status)}</span></td>
  </tr>`).join("");
  updateDashboardStats();
}

function updateDashboardStats() {
  const elPatients = document.getElementById("stat-patients");
  const elAppts = document.getElementById("stat-appts");
  const elClaims = document.getElementById("stat-claims");
  const elRevenue = document.getElementById("stat-revenue");

  if (elPatients) elPatients.textContent = (1284 + homePatients.length - 5).toLocaleString();
  if (elAppts) elAppts.textContent = "18";
  if (elClaims) elClaims.textContent = claimsData.filter(c => c.status === "pending").length;
  if (elRevenue) elRevenue.textContent = "84,200";
}

async function renderCompanies() {
  companies = await GetDataFromBackend("/companies/")
  if (!isValid(companies)) {
    console.warn("companies has not been fetched")
    return;
  }
  const grid = document.getElementById("company-grid");
  const list = companyFilter === "all" ? companies : companies.filter(c => c.status === companyFilter);
  if (grid === null) { return }
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
  btn.classList.add("on"); renderCompanies();
}

async function renderClaims() {
  const tb = document.getElementById("claims-tbody");
  claimsData = await GetDataFromBackend("/claims/")
  if (!isValid(claimsData)) {
    console.warn("claimsData has not been fetched")
    return;
  }
  const list = claimFilter === "all" ? claimsData : claimsData.filter(c => c.status === claimFilter);
  if (tb === null) { return }
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
  const item = list[i]; const gi = claimsData.indexOf(item);
  if (gi >= 0) claimsData[gi].status = decision;
  const pending = claimsData.filter(c => c.status === "pending").length;
  document.getElementById("claims-badge").textContent = pending;
  document.getElementById("c-pending-val").textContent = pending;
  document.getElementById("c-approved-val").textContent = claimsData.filter(c => c.status === "approved").length;
  document.getElementById("c-rejected-val").textContent = claimsData.filter(c => c.status === "rejected").length;
  renderClaims();
}

function filterClaims(f, btn) {
  claimFilter = f;
  document.querySelectorAll("#claims-filter-tabs .ftab").forEach(b => b.classList.remove("on"));
  btn.classList.add("on"); renderClaims();
}

async function renderApprovals() {
  // FIXME: approval button is not working
  const tb = document.getElementById("approvals-tbody");
  approvalsData = await GetDataFromBackend("/approvals/")
  if (!isValid(approvalsData)) {
    console.warn("approvalsData has not been fetched")
    return;
  }
  approvalRows = approvalsData.map(a => ({ ...a, status: "pending" }));


  const pending = approvalRows.filter(a => a.status === "pending");
  ap_badge = document.getElementById("approvals-badge")
  if (ap_badge === null) { return }
  ap_badge.textContent = pending.length || "0";
  if (!pending.length) { tb.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--muted)">✓ ${t("noPending")}</td></tr>`; return; }
  if (tb === null) { return }
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
  pending[i].status = decision; renderApprovals();
}
function approveAll() { approvalRows.forEach(a => { if (a.status === "pending") a.status = "approved"; }); renderApprovals(); }

async function renderPatients() {
  const tb = document.getElementById("pat-tbody");

  phones = await GetDataFromBackend("/phones/")
  homePatients = await GetDataFromBackend("/homePatients/")
  if (!isValid(homePatients)) {
    console.warn("homePatients has not been fetched")
    return;
  }
  if (tb === null) { return }
  tb.innerHTML = homePatients.map((p, i) => `<tr onclick="viewPatient(${i})" class="clickable-row">
    <td><div class="td-name"><div class="mini-avatar">${p.init}</div>${lang === "ar" ? p.arName : p.name}</div></td>
    <td>${p.age}</td><td style="color:var(--muted)">${p.phone || phones[i] || "010-0000-0000"}</td>
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

  homePatients.unshift({
    name: name,
    arName: name, // Fallback for Arabic layout
    init: initials(name),
    age: parseInt(age),
    doctor: doc,
    arDoc: doc,
    ins: ins === "None" ? "-" : ins,
    date: dateStr,
    status: "active",
    phone: phone
  });

  // Update UI lists
  renderHome();
  renderPatients();

  // Clear inputs
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
  document.getElementById("edit-patphone").value = p.phone || phones[index] || "";
  document.getElementById("edit-patwa").value = p.wa || "";
  document.getElementById("edit-patnid").value = p.nid || "";

  const insSelect = document.getElementById("edit-patins");
  if (Array.from(insSelect.options).some(o => o.value === p.ins)) insSelect.value = p.ins; else insSelect.value = "None";

  const docSelect = document.getElementById("edit-patdoc");
  if (Array.from(docSelect.options).some(o => o.value === p.doctor)) docSelect.value = p.doctor; else docSelect.selectedIndex = 0;

  // Disable all fields initially
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
  p.arName = newName; // In a real app we'd handle translation differently
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
  closeModal('editPatient');
}

function deletePatient() {
  if (currentPatientIndex < 0) return;
  if (confirm(lang === "ar" ? "هل أنت متأكد من حذف المريض؟" : "Are you sure you want to delete this patient?")) {
    homePatients.splice(currentPatientIndex, 1);

    renderHome();
    renderPatients();
    closeModal('editPatient');
  }
}

async function renderAppts() {

  const tb = document.getElementById("appt-tbody");
  appts = await GetDataFromBackend("/appointments/")
  if (!isValid(appts)) {
    console.warn("appts has not been fetched");
    return;
  }
  if (tb === null) {
    return
  }
  tb.innerHTML = appts.map(a => `<tr>
    <td style="font-weight:700">${a.time}</td><td>${a.patient}</td>
    <td style="color:var(--muted)">${a.doctor}</td><td>${a.type}</td>
    <td><span class="chip chip-${a.status}">${chip(a.status)}</span></td>
  </tr>`).join("");
}

async function renderBilling() {
  const tb = document.getElementById("bill-tbody");

  invoices = await GetDataFromBackend("/invoices/")
  if (!isValid(invoices)) {
    console.warn("invoices has not been fetched")
    return;
  }
  if (tb === null) { return }
  tb.innerHTML = invoices.map(v => `<tr>
    <td style="font-weight:700;color:var(--blue)">${v.id}</td><td>${v.patient}</td>
    <td style="color:var(--muted)">${v.date}</td><td style="font-weight:600">${v.amount}</td>
    <td style="color:var(--muted)">${v.ins}</td>
    <td><span class="chip chip-${v.status}">${chip(v.status)}</span></td>
  </tr>`).join("");
}

function openModal(id) { document.getElementById("modal-" + id).classList.add("show") }
function closeModal(id) { document.getElementById("modal-" + id).classList.remove("show") }
document.querySelectorAll(".modal-bg").forEach(m => m.addEventListener("click", e => { if (e.target === m) m.classList.remove("show") }));

applyLang();