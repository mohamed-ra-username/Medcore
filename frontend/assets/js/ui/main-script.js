/**
 * ==========================================
 * 🔴 CORE LOGIC - MEDCORE STATE STORE
 * ==========================================
 */
const Medcore = {
  state: {
    user: null,
    permissions: JSON.parse(localStorage.getItem("permissions") || "[]"),
    notifications: [],
    patients: [],
    claims: [],
    companies: [],
    approvals: [],
    appts: [],
    invoices: [],
    stats: {},
    statistics: {},
    isEditMode: false
  },

  can: (perm) => Medcore.state.permissions.includes(perm) || Medcore.state.permissions.includes("*"),

  init: async () => {
    if (localStorage.getItem("token")) {
      const res = await GETRequest("/me/");
      if (res && res.success) {
        Medcore.state.user = res.data.user;
        Medcore.state.permissions = res.data.permissions;
        localStorage.setItem("permissions", JSON.stringify(Medcore.state.permissions));
        const element_user_email = document.getElementById("user-email");
        element_user_email.textContent = Medcore.state.user;
      }
    }
  }
};
let notifDot
window.onload = async () => {
  notifDot = document.getElementById("notif-dot");

  loadDummyNotifications();
  loadNotifications()
  await Medcore.init();
  applyLang();
  setupSearch();
  updatePermissionsUI();
  setupEventListeners();

  // Update dynamic date in header
  const headerDate = document.getElementById("header-date");
  if (headerDate) {
    headerDate.textContent = Utils.formatFullDate();
  }

  window.isUIReady = true;
  document.dispatchEvent(new CustomEvent("medcore:ui_ready"));
  console.info("🏛️ Monolith UI Initialized. Waiting for data...");
};

/**
 * ==========================================
 * 📢 BROADCAST LISTENERS
 * ==========================================
 */
function setupEventListeners() {
  document.addEventListener("medcore:patients_updated", (e) => {
    Medcore.state.patients = e.detail;
    syncPatientTable(e.detail);
    renderPatients(e.detail);
  });
  document.addEventListener("medcore:stats_updated", (e) => updateDashboardStats(e.detail));
  document.addEventListener("medcore:statistics_updated", (e) => updateDashboardStatistics(e.detail));
  document.addEventListener("medcore:claims_updated", (e) => {
    Medcore.state.claims = e.detail;
    renderClaims(e.detail);
  });
  document.addEventListener("medcore:companies_updated", (e) => {
    Medcore.state.companies = e.detail;
    renderCompanies(e.detail);
  });
  document.addEventListener("medcore:approvals_updated", (e) => {
    Medcore.state.approvals = e.detail;
    renderApprovals(e.detail);
  });
  document.addEventListener("medcore:appts_updated", (e) => {
    Medcore.state.appts = e.detail;
    renderAppts(e.detail);
  });
  document.addEventListener("medcore:billing_updated", (e) => {
    Medcore.state.invoices = e.detail;
    renderBilling(e.detail);
  });
}

/**
 * ==========================================
 * ⚡ SMART SYNC ENGINE
 * ==========================================
 */
function syncPatientTable(freshData) {
  if (!freshData) return;

  const tbody = document.getElementById("home-tbody");
  if (!tbody) return;

  const existingRows = Array.from(tbody.querySelectorAll("tr[data-id]"));
  const freshIds = freshData.map(p => p.id);

  existingRows.forEach(row => {
    if (!freshIds.includes(row.dataset.id)) row.remove();
  });

  const fragment = document.createDocumentFragment();

  freshData.forEach((p) => {
    let row = tbody.querySelector(`tr[data-id="${p.id}"]`);
    if (row) {
      if (row.dataset.status !== p.status) {
        row.outerHTML = drawPatientRow(p);
      }
    } else {
      const temp = document.createElement('tbody');
      temp.innerHTML = drawPatientRow(p);
      fragment.appendChild(temp.firstElementChild);
    }
  });

  if (tbody.innerText.includes("Loading")) tbody.innerHTML = "";
  tbody.appendChild(fragment);
}

/**
 * ==========================================
 * 🟢 UI UPDATERS (Logic Only)
 * ==========================================
 */
async function updateDashboardStatistics(st) {
  if (!st) return;
  Medcore.state.statistics = st;

  const mapping = {
    "statistics-patients": st.patients ?? "",
    "statistics-revenue": st.revenue ?? "",
    "statistics-appointments": st.appointments ?? ""
  };

  for (const [id, val] of Object.entries(mapping)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
}

async function updateDashboardStats(st) {
  if (!st) return;
  Medcore.state.stats = st;

  const mapping = {
    "stat-patients": st.home?.patients ?? 0,
    "stat-appts": st.home?.appts ?? 0,
    "stat-claims": st.home?.claims ?? 0,
    "stat-revenue": st.home?.revenue ?? 0,
    "sb-total-val": st.insurance?.total ?? 0,
    "sb-active-val": st.insurance?.active ?? 0,
    "sb-expiring-val": st.insurance?.expiring ?? 0,
    "sb-claims-total-val": st.insurance?.claims ?? 0,
    "c-pending-val": st.claims?.pending ?? 0,
    "c-approved-val": st.claims?.approved ?? 0,
    "c-rejected-val": st.claims?.rejected ?? 0,
    "c-amount-val": st.claims?.total_amount ?? 0
  };

  for (const [id, val] of Object.entries(mapping)) {
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute("data-value", val);
      el.textContent = Utils.formatNumber(val);
    }
  }

  update_badge("patients-badge", st.home?.patients ?? 0);
  update_badge("appointments-badge", st.home?.appts ?? 0);
  update_badge("claims-badge", st.claims?.pending ?? 0);
  update_badge("approvals-badge", st.insurance?.pending ?? 0);
}

function update_badge(elementId, value) {
  let badge = document.getElementById(elementId);
  if (!badge) return;
  badge.setAttribute("data-value", value);
  badge.textContent = Utils.formatNumber(value);
}

function setupSearch() {
  document.getElementById("home-search")?.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = Medcore.state.patients.filter(p => p.name?.toLowerCase().includes(term));
    renderPatients(filtered);
  });
  document.getElementById("claims-search")?.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = Medcore.state.claims.filter(c => c.patient?.toLowerCase().includes(term));
    renderClaims( filtered);
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
  const target = document.getElementById("page-" + id);
  if (target) target.classList.add("active");
  if (btn) btn.classList.add("active");
}

async function renderHome() { /* syncPatientTable handles this */ }

/**
 * ==========================================
 * ⚡ ACTION HANDLERS
 * ==========================================
 */

let currentPatientId = null;
function viewPatient(id) {
  if (!Medcore.state.isEditMode) return;
  currentPatientId = id;
  const p = Medcore.state.patients.find(p => p.id === id);
  if (!p) return;
  const modal = document.getElementById("modal-editPatient");
  if (!modal) return;
  const inputs = modal.querySelectorAll("input, select, textarea");
  inputs.forEach(input => { if (input.name && p[input.name] !== undefined) input.value = p[input.name]; });
  openModal("editPatient");
}

async function setStatus(target, status) {
  const row = target.closest("tr");
  const id = row?.dataset.id;
  if (!id) return;

  const res = await PUTRequest(`/claims/${id}/status/`, { status });

  if (res && res.success) {
    showToast(`Claim ${status} successfully`);

    // Update local state
    const claim = Medcore.state.claims.find(c => c.id === id);
    if (claim) {
      claim.status = status;
      // Surgical UI Update using Rendering Engine
      row.outerHTML = drawClaimRow(claim);
    }
  } else {
    alert("Failed to update status: " + (res?.error || "Server Error"));
    // Re-enable the specific button that was clicked
    target.disabled = false;
  }
}

function openReview(target) {
  target_row = target.parent

}

function toggleEditMode() {
  Medcore.state.isEditMode = !Medcore.state.isEditMode;
  const btns = document.querySelectorAll(".btn-toggle-edit");
  btns.forEach(btn => {
    btn.textContent = Medcore.state.isEditMode ? "Done" : "Edit";
    btn.classList.toggle("active", Medcore.state.isEditMode);
  });
  document.body.classList.toggle("edit-mode-active", Medcore.state.isEditMode);
}
