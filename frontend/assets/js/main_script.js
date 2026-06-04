const role = localStorage.getItem("role");

window.onload = () => {
  applyLang();
  setupSearch();
};

function showLocaleNumber(num) {
  return numberFormatter.format(num);
}

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

let lang = localStorage.getItem("lang") ?? "en";
let locale = lang === "ar" ? "ar-EG" : "en-US";
let numberFormatter = new Intl.NumberFormat(locale);
localStorage.setItem("lang", lang);

function update_badge(elementId, value) {
  let badge = document.getElementById(elementId);
  if (!badge) {
    console.error(`Couldn't get element: ${elementId}`);
    return;
  }
  badge.dataset["value"] = value;
  badge.textContent = showLocaleNumber(value);
}

async function updateAllDashboards() {
  await window.dataLoaded;
  if (!stats) return;

  // Home Dashboard
  if (document.getElementById("stat-patients")) {
    const el = document.getElementById("stat-patients");
    el.textContent = showLocaleNumber(stats.home.patients);
  }
  if (document.getElementById("stat-appts")) document.getElementById("stat-appts").textContent = showLocaleNumber(stats.home.appts);
  if (document.getElementById("stat-claims")) document.getElementById("stat-claims").textContent = showLocaleNumber(stats.home.claims);
  if (document.getElementById("stat-revenue")) document.getElementById("stat-revenue").textContent = showLocaleNumber(stats.home.revenue);

  // Insurance Page
  if (document.getElementById("sb-total-val")) document.getElementById("sb-total-val").textContent = showLocaleNumber(stats.insurance.total);
  if (document.getElementById("sb-active-val")) document.getElementById("sb-active-val").textContent = showLocaleNumber(stats.insurance.active);
  if (document.getElementById("sb-expiring-val")) document.getElementById("sb-expiring-val").textContent = showLocaleNumber(stats.insurance.expiring);
  if (document.getElementById("sb-claims-total-val")) document.getElementById("sb-claims-total-val").textContent = showLocaleNumber(stats.insurance.claims);

  // Claims Page
  if (document.getElementById("c-pending-val")) document.getElementById("c-pending-val").textContent = showLocaleNumber(stats.claims.pending);
  if (document.getElementById("c-approved-val")) document.getElementById("c-approved-val").textContent = showLocaleNumber(stats.claims.approved);
  if (document.getElementById("c-rejected-val")) document.getElementById("c-rejected-val").textContent = showLocaleNumber(stats.claims.rejected);
  if (document.getElementById("c-amount-val")) document.getElementById("c-amount-val").textContent = showLocaleNumber(stats.claims.total_amount);

  // Billing Page
  if (document.getElementById("bill-total-revenue")) document.getElementById("bill-total-revenue").textContent = showLocaleNumber(stats.billing.total);
  if (document.getElementById("bill-collected")) document.getElementById("bill-collected").textContent = showLocaleNumber(stats.billing.collected);
  if (document.getElementById("bill-ins-due")) document.getElementById("bill-ins-due").textContent = showLocaleNumber(stats.billing.ins_due);
  if (document.getElementById("bill-overdue")) document.getElementById("bill-overdue").textContent = showLocaleNumber(stats.billing.overdue);

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
  total_elemnt.textContent = showLocaleNumber(sum);
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
    <td style="font-weight:600">${showLocaleNumber(c.amount)}</td>
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
  if (ap_badge) ap_badge.textContent = showLocaleNumber(pending.length || 0);

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
    <td style="font-weight:600">${showLocaleNumber(a.amount)}</td>
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

let currentPatientIndex = -1;

function viewPatient(index) {
  currentPatientIndex = index;
  const p = homePatients[index];
  const modal = document.getElementById("modal-editPatient");
  
  // Populate all inputs that have a name attribute
  const inputs = modal.querySelectorAll("input, select, textarea");
  inputs.forEach(input => {
    if (input.name && p[input.name] !== undefined) {
        input.value = p[input.name];
    }
  });

  // Special cases
  document.getElementById("edit-patname").value = lang === "ar" ? (p.arName || p.name) : p.name;

  // Disable all fields by default (View Mode)
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
    <td style="color:var(--muted)">${v.date}</td><td style="font-weight:600">${showLocaleNumber(v.amount)}</td>
    <td style="color:var(--muted)">${v.ins}</td>
    <td><span class="chip chip-${v.status}">${chip(v.status)}</span></td>
  </tr>`).join("");
}
