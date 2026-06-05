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
  
  can: (perm) => Medcore.state.permissions.includes(perm) || Medcore.state.permissions.includes("*"),
  
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
  await Medcore.init();
  applyLang();
  setupSearch();
  updatePermissionsUI();
  setupEventListeners();
  
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
        syncPatientTable(e.detail);
        renderPatients(e.detail);
    });
    document.addEventListener("medcore:stats_updated", (e) => updateDashboardStats(e.detail));
    document.addEventListener("medcore:claims_updated", (e) => renderClaims(null, e.detail));
    document.addEventListener("medcore:companies_updated", (e) => renderCompanies(e.detail));
    document.addEventListener("medcore:approvals_updated", (e) => renderApprovals(e.detail));
    document.addEventListener("medcore:appts_updated", (e) => renderAppts(e.detail));
    document.addEventListener("medcore:billing_updated", (e) => renderBilling(e.detail));
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

    if (tbody.innerText.includes("Loading")) tbody.innerHTML = "";
    tbody.appendChild(fragment);
    Medcore.state.patients = freshData;
}

function createPatientRow(p, index) {
    const tr = document.createElement("tr");
    tr.classList.add("clickable-row");
    tr.dataset.id = p.id;
    tr.dataset.status = p.status;
    tr.onclick = () => viewPatient(index);
    
    const enName = p.name || 'N/A';
    const arName = p.arName || enName;
    const enDoc = p.doctor || 'N/A';
    const arDoc = p.arDoc || enDoc;
    const age = p.age || 'N/A';
    const ins = p.ins || 'N/A';
    
    tr.innerHTML = `
      <td><div class="td-name"><div class="mini-avatar">${p.init || '??'}</div><span class="dyn-text" data-en="${enName}" data-ar="${arName}">${Utils.lang === "ar" ? arName : enName}</span></div></td>
      <td class="dyn-num" data-value="${age}">${age}</td>
      <td style="color:var(--muted)" class="dyn-text" data-en="${enDoc}" data-ar="${arDoc}">${Utils.lang === "ar" ? arDoc : enDoc}</td>
      <td style="color:var(--muted)">${ins}</td>
      <td style="color:var(--muted)" class="dyn-date" data-value="${p.date || 'N/A'}">${p.date ? Utils.formatDate(p.date) : 'N/A'}</td>
      <td class="status-cell"><span class="chip chip-${p.status || 'unknown'}">${chip(p.status || 'unknown')}</span></td>
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
  const target = document.getElementById("page-" + id);
  if (target) target.classList.add("active");
  if (btn) btn.classList.add("active");
}

async function renderHome() { /* syncPatientTable handles this */ }

async function renderCompanies(list) {
  if (!list) return;
  const grid = document.getElementById("company-grid");
  if (!grid) return;
  grid.innerHTML = list.map(c => {
    const name = c.name || 'N/A';
    const type = c.type || 'N/A';
    const claims = c.claims || 0;
    
    // Clean limit string (strip commas) before formatting
    const rawLimit = String(c.limit || "0").replace(/,/g, '');
    const limitNum = parseFloat(rawLimit);
    
    return `
    <div class="company-card">
      <div class="cc-header">
        <div class="cc-logo" style="background:${c.color || '#eee'}">${c.init || 'CO'}</div>
        <div style="flex:1"><div class="cc-name">${name}</div><div class="cc-type">${type}</div></div>
        <span class="chip ${c.status === "expiring" ? "chip-expiring" : "chip-active"}">${chip(c.status || 'active')}</span>
      </div>
      <div class="cc-row">
        <div class="cc-kpi"><div class="cc-kpi-val dyn-num" data-value="${claims}">${Utils.formatNumber(claims)}</div><div class="cc-kpi-lbl">${t("claims")}</div></div>
        <div class="cc-kpi"><div class="cc-kpi-val dyn-num" data-value="${limitNum}">${Utils.formatNumber(limitNum)}</div><div class="cc-kpi-lbl">${t("limit")}</div></div>
        <div class="cc-kpi"><div class="cc-kpi-val dyn-date" data-value="${c.end || 'N/A'}" style="color:${c.status === "expiring" ? "#E65100" : "var(--teal)"}">${c.end ? Utils.formatDate(c.end) : 'N/A'}</div><div class="cc-kpi-lbl">${t("expires")}</div></div>
      </div>
    </div>`
  }).join("");
}

async function renderClaims(filter, list) {
  const tb = document.getElementById("claims-tbody");
  if (!tb || !list) return;
  tb.innerHTML = list.map((c, i) => {
    const patName = c.patient || 'N/A';
    const amount = c.amount || 0;
    return `<tr>
      <td style="font-weight:700;color:var(--blue)">${c.id || 'N/A'}</td>
      <td><div class="td-name"><div class="mini-avatar">${Utils.initials(patName)}</div>${patName}</div></td>
      <td style="font-weight:600" class="dyn-num" data-value="${amount}">${Utils.formatNumber(amount)}</td>
      <td><span class="chip chip-${c.status || 'pending'}">${chip(c.status || 'pending')}</span></td>
      <td>${c.status === "pending" ? `<button onclick="closeClaim(${i},'approved')">Approve</button>` : ''}</td>
    </tr>`
  }).join("");
}

async function renderPatients(list) {
  const tb = document.getElementById("pat-tbody");
  if (!tb || !list) return;
  tb.innerHTML = list.map((p, i) => {
    const enName = p.name || 'N/A';
    const arName = p.arName || enName;
    const phone = p.phone || 'N/A';
    const age = p.age || 'N/A';
    return `<tr class="clickable-row" onclick="viewPatient(${i})">
      <td><div class="td-name"><div class="mini-avatar">${p.init || '??'}</div><span class="dyn-text" data-en="${enName}" data-ar="${arName}">${Utils.lang === "ar" ? arName : enName}</span></div></td>
      <td class="dyn-num" data-value="${age}">${age}</td>
      <td style="color:var(--muted)">${phone}</td>
      <td class="status-cell"><span class="chip chip-${p.status || 'unknown'}">${chip(p.status || 'unknown')}</span></td>
    </tr>`
  }).join("");
}

async function renderApprovals(list) {
  const tb = document.getElementById("approvals-tbody");
  if (!tb || !list) return;
  tb.innerHTML = list.map((a, i) => {
    const patName = a.patient || 'N/A';
    const proc = a.procedure || 'N/A';
    // Fix key: 'ref' instead of 'id'
    const ref = a.ref || 'N/A';
    
    return `<tr>
      <td style="font-weight:700;color:var(--blue)">${ref}</td>
      <td><div class="td-name"><div class="mini-avatar">${Utils.initials(patName)}</div>${patName}</div></td>
      <td class="dyn-text" data-en="${proc}" data-ar="${a.arProc || proc}">${Utils.lang === "ar" ? (a.arProc || proc) : proc}</td>
      <td><span class="chip chip-${a.status || 'pending'}">${chip(a.status || 'pending')}</span></td>
      <td>${a.status === "pending" ? `<button onclick="approveAction(${i})">Review</button>` : ''}</td>
    </tr>`
  }).join("");
}

async function renderAppts(list) {
  const tb = document.getElementById("appt-tbody");
  if (!tb || !list) return;
  tb.innerHTML = list.map((a, i) => {
    const patName = a.patient || 'N/A';
    const enDoc = a.doctor || 'N/A';
    const arDoc = a.arDoc || enDoc;
    // Fix key: 'time' instead of 'date'
    const time = a.time || 'N/A';
    
    return `<tr>
      <td>${time}</td>
      <td><div class="td-name"><div class="mini-avatar">${Utils.initials(patName)}</div>${patName}</div></td>
      <td style="color:var(--muted)" class="dyn-text" data-en="${enDoc}" data-ar="${arDoc}">${Utils.lang === "ar" ? arDoc : enDoc}</td>
      <td><span class="chip chip-${a.status || 'unknown'}">${chip(a.status || 'unknown')}</span></td>
    </tr>`
  }).join("");
}

async function renderBilling(list) {
  const tb = document.getElementById("bill-tbody");
  if (!tb || !list) return;
  tb.innerHTML = list.map((v, i) => {
    const patName = v.patient || 'N/A';
    const amount = v.amount || 0;
    return `<tr>
      <td style="font-weight:700;color:var(--blue)">${v.id || 'N/A'}</td>
      <td><div class="td-name"><div class="mini-avatar">${Utils.initials(patName)}</div>${patName}</div></td>
      <td style="font-weight:600" class="dyn-num" data-value="${amount}">${Utils.formatNumber(amount)}</td>
      <td><span class="chip chip-${v.status || 'pending'}">${chip(v.status || 'pending')}</span></td>
    </tr>`
  }).join("");
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
