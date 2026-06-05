/**
 * ==========================================
 * 🔴 CORE LOGIC - MEDCORE STATE STORE
 * ==========================================
 */
const Medcore = {
  state: {
    user: null,
    permissions: JSON.parse(localStorage.getItem("permissions") || "[]"),
    patients: [],
    stats: {}
  },
  
  // Helper to check permissions
  can: (perm) => Medcore.state.permissions.includes(perm) || Medcore.state.permissions.includes("*"),
  
  // Initialize user session
  init: async () => {
    if (localStorage.getItem("token")) {
      const res = await GETRequest("/me/");
      if (res && res.success) {
        Medcore.state.user = res.data.user;
        Medcore.state.permissions = res.data.permissions;
        localStorage.setItem("permissions", JSON.stringify(Medcore.state.permissions));
      }
    }
  }
};

window.onload = async () => {
  await window.componentsLoaded;
  await Medcore.init();
  applyLang();
  setupSearch();
  updatePermissionsUI();
  setupEventListeners();
};

/**
 * ==========================================
 * 📢 BROADCAST LISTENERS
 * ==========================================
 */
function setupEventListeners() {
    document.addEventListener("medcore:patients_updated", (e) => syncPatientTable(e.detail));
    document.addEventListener("medcore:stats_updated", (e) => updateDashboardStats(e.detail));
    document.addEventListener("medcore:claims_updated", (e) => renderClaims(null, e.detail));
    document.addEventListener("medcore:companies_updated", (e) => renderCompanies(e.detail));
}

/**
 * ==========================================
 * ⚡ SMART SYNC ENGINE
 * ==========================================
 */
function syncPatientTable(freshData) {
    const tbody = document.getElementById("home-tbody");
    if (!tbody) return;

    // 1. Identify rows to remove
    const existingRows = Array.from(tbody.querySelectorAll("tr[data-id]"));
    const freshIds = freshData.map(p => p.id);
    
    existingRows.forEach(row => {
        if (!freshIds.includes(row.dataset.id)) row.remove();
    });

    // 2. Add or Update rows
    const fragment = document.createDocumentFragment();
    
    freshData.forEach((p, index) => {
        let row = tbody.querySelector(`tr[data-id="${p.id}"]`);
        
        if (row) {
            if (row.dataset.status !== p.status) {
                row.dataset.status = p.status;
                row.querySelector(".status-cell").innerHTML = `<span class="chip chip-${p.status}">${chip(p.status)}</span>`;
            }
        } else {
            const newRow = createPatientRow(p, index);
            fragment.appendChild(newRow);
        }
    });

    tbody.appendChild(fragment);
    Medcore.state.patients = freshData; // Update local store
}

function createPatientRow(p, index) {
    const tr = document.createElement("tr");
    tr.classList.add("clickable-row");
    tr.dataset.id = p.id;
    tr.dataset.status = p.status;
    tr.onclick = () => viewPatient(index);
    
    tr.innerHTML = `
      <td><div class="td-name"><div class="mini-avatar">${p.init}</div>${Utils.lang === "ar" ? p.arName : p.name}</div></td>
      <td>${p.age}</td>
      <td style="color:var(--muted)">${Utils.lang === "ar" ? p.arDoc : p.doctor}</td>
      <td style="color:var(--muted)">${p.ins}</td>
      <td style="color:var(--muted)">${Utils.formatDate(p.date)}</td>
      <td class="status-cell"><span class="chip chip-${p.status}">${chip(p.status)}</span></td>
    `;
    return tr;
}

/**
 * ==========================================
 * 🟢 UI UPDATERS
 * ==========================================
 */
async function updateDashboardStats(st) {
  if (!st) return;

  const mapping = {
    "stat-patients": st.home.patients,
    "stat-appts": st.home.appts,
    "stat-claims": st.home.claims,
    "stat-revenue": st.home.revenue,
    "sb-total-val": st.insurance.total,
    "sb-active-val": st.insurance.active,
    "sb-expiring-val": st.insurance.expiring,
    "sb-claims-total-val": st.insurance.claims,
    "c-pending-val": st.claims.pending,
    "c-approved-val": st.claims.approved,
    "c-rejected-val": st.claims.rejected,
    "c-amount-val": st.claims.total_amount
  };

  for (const [id, val] of Object.entries(mapping)) {
    const el = document.getElementById(id);
    if (el) el.textContent = Utils.formatNumber(val);
  }

  update_badge("patients-badge", st.home.patients);
  update_badge("appointments-badge", st.home.appts);
  update_badge("claims-badge", st.claims.pending);
  update_badge("approvals-badge", st.insurance.pending);
}

function update_badge(elementId, value) {
  let badge = document.getElementById(elementId);
  if (!badge) return;
  badge.textContent = Utils.formatNumber(value);
}

function setupSearch() {
  document.getElementById("home-search")?.addEventListener("input", (e) => {
      renderHome(e.target.value.toLowerCase());
  });
  document.getElementById("claims-search")?.addEventListener("input", (e) => {
      renderClaims(e.target.value.toLowerCase());
  });
}

function updatePermissionsUI() {
  if (!Medcore.can("view_revenue")) {
    const revElements = document.querySelectorAll(".stat-card:nth-child(4), button[onclick=\"goPage('billing',this)\"]");
    revElements.forEach(el => el.style.display = "none");
  }
}

function goPage(id, btn) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
  document.getElementById("page-" + id).classList.add("active");
  btn.classList.add("active");
}

async function renderHome() { /* Handled by syncPatientTable now */ }

async function renderCompanies(list) {
  if (!list) return;
  const grid = document.getElementById("company-grid");
  if (!grid) return;
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

async function renderClaims(filter, list) {
  const tb = document.getElementById("claims-tbody");
  if (!tb || !list) return;
  tb.innerHTML = list.map((c, i) => `<tr>
    <td style="font-weight:700;color:var(--blue)">${c.id}</td>
    <td><div class="td-name"><div class="mini-avatar">${Utils.initials(c.patient)}</div>${c.patient}</div></td>
    <td style="font-weight:600">${Utils.formatNumber(c.amount)}</td>
    <td><span class="chip chip-${c.status}">${chip(c.status)}</span></td>
    <td>${c.status === "pending" ? `<button onclick="closeClaim(${i},'approved')">Approve</button>` : ''}</td>
  </tr>`).join("");
}

let currentPatientIndex = -1;
function viewPatient(index) {
  currentPatientIndex = index;
  const p = Medcore.state.patients[index];
  const modal = document.getElementById("modal-editPatient");
  if (!modal) return;
  const inputs = modal.querySelectorAll("input, select, textarea");
  inputs.forEach(input => { if (input.name && p[input.name] !== undefined) input.value = p[input.name]; });
  openModal("editPatient");
}
