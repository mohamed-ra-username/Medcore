import { GETRequest, PUTRequest } from '../core/api-client.js';
import { Utils, debounce } from '../core/utils.js';
import { applyLang } from '../services/translation.js';
import { loadDummyNotifications, loadNotifications } from './notifications.js';
import { openModal } from './modal-handling.js';
import {
  renderPatients,
  renderHomePatients,
  renderClaims,
  renderCompanies,
  renderApprovals,
  renderAppts,
  renderBilling,
  drawPatientRow,
  drawClaimRow
} from './rendering.js';

/**
 * ==========================================
 * 🔴 CORE LOGIC - MEDCORE STATE STORE (Reactive Store)
 * ==========================================
 */

const storeSubscribers = {};

export function subscribeState(key, callback) {
  if (!storeSubscribers[key]) storeSubscribers[key] = [];
  storeSubscribers[key].push(callback);
}

const rawState = {
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
  isEditMode: false,
  currentPatientId: null
};

export const Medcore = {
  state: {},
  can: (perm) => Medcore.state.permissions.includes(perm) || Medcore.state.permissions.includes("*"),
  init: async () => {
    if (localStorage.getItem("token")) {
      const res = await GETRequest("/me/");
      if (res && res.success) {
        Medcore.state.user = res.data.user;
        Medcore.state.permissions = res.data.permissions;
        localStorage.setItem("permissions", JSON.stringify(Medcore.state.permissions));
        const element_user_email = document.getElementById("user-email");
        if (element_user_email) element_user_email.textContent = Medcore.state.user;
      }
    }
  }
};

// Define reactive property getters/setters on state
for (const key of Object.keys(rawState)) {
  Object.defineProperty(Medcore.state, key, {
    get() {
      return rawState[key];
    },
    set(newVal) {
      if (JSON.stringify(rawState[key]) === JSON.stringify(newVal)) return;
      rawState[key] = newVal;
      if (storeSubscribers[key]) {
        storeSubscribers[key].forEach(cb => cb(newVal));
      }
    },
    configurable: true,
    enumerable: true
  });
}

export async function initUI() {
  // Register state subscribers reactively mapping store changes to rendering.js
  subscribeState("patients", (list) => {
    renderHomePatients(list);
    renderPatients(list);
    recalculateStats();
  });
  subscribeState("claims", (list) => {
    renderClaims(list);
    recalculateStats();
  });
  subscribeState("companies", (list) => {
    renderCompanies(list);
    recalculateStats();
  });
  subscribeState("approvals", (list) => {
    renderApprovals(list);
    recalculateStats();
  });
  subscribeState("appts", (list) => {
    renderAppts(list);
    recalculateStats();
  });
  subscribeState("invoices", (list) => {
    renderBilling(list);
    recalculateStats();
  });

  loadDummyNotifications();
  loadNotifications();
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

  console.info("🏛️ Monolith UI Initialized. Waiting for data...");
}

/**
 * ==========================================
 * 📢 BROADCAST LISTENERS
 * ==========================================
 */
function setupEventListeners() {
  document.addEventListener("medcore:patients_updated", (e) => {
    Medcore.state.patients = e.detail;
  });
  document.addEventListener("medcore:statistics_updated", (e) => updateDashboardStatistics(e.detail));
  document.addEventListener("medcore:claims_updated", (e) => {
    Medcore.state.claims = e.detail;
  });
  document.addEventListener("medcore:companies_updated", (e) => {
    Medcore.state.companies = e.detail;
  });
  document.addEventListener("medcore:approvals_updated", (e) => {
    Medcore.state.approvals = e.detail;
  });
  document.addEventListener("medcore:appts_updated", (e) => {
    Medcore.state.appts = e.detail;
  });
  document.addEventListener("medcore:billing_updated", (e) => {
    Medcore.state.invoices = e.detail;
  });
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

export function recalculateStats() {
  const patients = Medcore.state.patients;
  const appts = Medcore.state.appts;
  const claims = Medcore.state.claims;
  const companies = Medcore.state.companies;
  const approvals = Medcore.state.approvals;

  // 1. Home Dashboard Stats & Badges
  if (patients !== undefined && patients !== null) {
    const activePatients = patients.filter(p => p.status === "active").length;
    const el = document.getElementById("stat-patients");
    if (el) el.textContent = Utils.formatNumber(activePatients);
    
    update_badge("patients-badge", activePatients);
  }

  if (appts !== undefined && appts !== null) {
    const activeAppts = appts.filter(a => a.status === "active").length;
    const el = document.getElementById("stat-appts");
    if (el) el.textContent = Utils.formatNumber(activeAppts);
    
    update_badge("appointments-badge", activeAppts);
  }

  if (claims !== undefined && claims !== null) {
    const pendingClaims = claims.filter(c => c.status === "pending").length;
    const el = document.getElementById("stat-claims");
    if (el) el.textContent = Utils.formatNumber(pendingClaims);
    
    const approvedClaims = claims.filter(c => c.status === "approved");
    const revenue = approvedClaims.reduce((sum, c) => sum + (parseInt(c.amount) || 0), 0);
    const revEl = document.getElementById("stat-revenue");
    if (revEl) revEl.textContent = Utils.formatNumber(revenue);
    
    update_badge("claims-badge", pendingClaims);

    // Claims Tab Sub-metrics
    const approvedCount = approvedClaims.length;
    const rejectedCount = claims.filter(c => c.status === "rejected").length;
    const totalAmount = claims.reduce((sum, c) => sum + (parseInt(c.amount) || 0), 0);

    const mapping = {
      "c-pending-val": pendingClaims,
      "c-approved-val": approvedCount,
      "c-rejected-val": rejectedCount,
      "c-amount-val": totalAmount
    };
    for (const [id, val] of Object.entries(mapping)) {
      const el = document.getElementById(id);
      if (el) {
        el.setAttribute("data-value", val);
        el.textContent = Utils.formatNumber(val);
      }
    }
  }

  // 2. Insurance Tab Sub-metrics
  if (companies !== undefined && companies !== null) {
    const total = companies.length;
    const active = companies.filter(c => c.status === "active").length;
    const expiring = companies.filter(c => c.status === "expiring").length;
    const totalClaims = companies.reduce((sum, c) => sum + (parseInt(c.claims) || 0), 0);

    const mapping = {
      "sb-total-val": total,
      "sb-active-val": active,
      "sb-expiring-val": expiring,
      "sb-claims-total-val": totalClaims
    };
    for (const [id, val] of Object.entries(mapping)) {
      const el = document.getElementById(id);
      if (el) {
        el.setAttribute("data-value", val);
        el.textContent = Utils.formatNumber(val);
      }
    }
  }

  // 3. Approvals Sidebar Badge
  if (approvals !== undefined && approvals !== null) {
    const pendingApprovals = approvals.filter(a => a.status === "pending").length;
    update_badge("approvals-badge", pendingApprovals);
  }
}

function update_badge(elementId, value) {
  let badge = document.getElementById(elementId);
  if (!badge) return;
  badge.setAttribute("data-value", value);
  badge.textContent = Utils.formatNumber(value);
}

function setupSearch() {
  document.getElementById("home-search")?.addEventListener("input", debounce((e) => {
    const term = e.target.value.toLowerCase();
    const filtered = Medcore.state.patients.filter(p => p.name?.toLowerCase().includes(term));
    renderPatients(filtered);
  }));
  document.getElementById("claims-search")?.addEventListener("input", debounce((e) => {
    const term = e.target.value.toLowerCase();
    const filtered = Medcore.state.claims.filter(c => c.patient?.toLowerCase().includes(term));
    renderClaims(filtered);
  }));
}

function updatePermissionsUI() {
  if (!Medcore.can("view_revenue")) {
    const revElements = document.querySelectorAll(".stat-card:nth-child(4), button[onclick=\"goPage('billing',this)\"]");
    revElements.forEach(el => el.style.display = "none");
  }
}

export function goPage(id, btn) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
  const target = document.getElementById("page-" + id);
  if (target) target.classList.add("active");
  if (btn) btn.classList.add("active");
}

export function viewPatient(id) {
  if (!Medcore.state.isEditMode) return;
  Medcore.state.currentPatientId = id;
  const p = Medcore.state.patients.find(p => p.id === id);
  if (!p) return;
  const modal = document.getElementById("modal-editPatient");
  if (!modal) return;
  const inputs = modal.querySelectorAll("input, select, textarea");
  inputs.forEach(input => { if (input.name && p[input.name] !== undefined) input.value = p[input.name]; });
  openModal("editPatient");
}

export async function setStatus(target, status) {
  const row = target.closest("tr");
  const id = row?.dataset.key || row?.dataset.id;
  if (!id) return;

  const res = await PUTRequest(`/claims/${id}/status/`, { status });

  if (res && res.success) {
    const claim = Medcore.state.claims.find(c => c.id === id);
    if (claim) {
      claim.status = status;
      Medcore.state.claims = [...Medcore.state.claims]; // Reactively update UI
    }
  } else {
    alert("Failed to update status: " + (res?.error || "Server Error"));
    target.disabled = false;
  }
}

export function openReview(target) {
  // target_row = target.parent
}

export function toggleEditMode() {
  Medcore.state.isEditMode = !Medcore.state.isEditMode;
  const btns = document.querySelectorAll(".btn-toggle-edit");
  btns.forEach(btn => {
    btn.textContent = Medcore.state.isEditMode ? "Done" : "Edit";
    btn.classList.toggle("active", Medcore.state.isEditMode);
  });
  document.body.classList.toggle("edit-mode-active", Medcore.state.isEditMode);
}
