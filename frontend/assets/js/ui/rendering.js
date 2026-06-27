/**
 * ==========================================
 * 🎨 RENDERING ENGINE (Visuals Only)
 * ==========================================
 * This file contains all HTML template functions and table renderers.
 */

// --- 🧱 ROW COMPONENTS (Single Item Templates) ---

function drawPatientRow(p) {
  const enName = p.name || 'N/A';
  const arName = p.arName || enName;
  const enDoc = p.doctor || 'N/A';
  const arDoc = p.arDoc || enDoc;
  const age = p.age || 'N/A';
  const ins = p.ins || 'N/A';

  return `<tr class="clickable-row" data-id="${p.id}" data-status="${p.status || 'active'}" onclick="viewPatient('${p.id}')">
      <td><div class="td-name"><div class="mini-avatar">${p.init || '??'}</div><span class="dyn-text" data-en="${enName}" data-ar="${arName}">${Utils.lang === "ar" ? arName : enName}</span></div></td>
      <td class="dyn-num" data-value="${age}">${age}</td>
      <td style="color:var(--muted)" class="dyn-text" data-en="${enDoc}" data-ar="${arDoc}">${Utils.lang === "ar" ? arDoc : enDoc}</td>
      <td style="color:var(--muted)">${ins}</td>
      <td style="color:var(--muted)" class="dyn-date" data-value="${p.date || 'N/A'}">${p.date ? Utils.formatDate(p.date) : 'N/A'}</td>
      <td class="status-cell"><span class="chip chip-${p.status || 'unknown'}">${chip(p.status || 'unknown')}</span></td>
    </tr>`;
}

function drawClaimRow(c) {
  const patName = c.patient || 'N/A';
  const amount = c.amount || 0;
  const status = c.status || 'pending';
  return `<tr data-id="${c.id}" data-status="${status}">
    <td style="font-weight:700;color:var(--blue)">${c.id || 'N/A'}</td>
    <td><div class="td-name"><div class="mini-avatar">${Utils.initials(patName)}</div>${patName}</div></td>
    <td style="font-weight:600" class="dyn-num" data-value="${amount}">${Utils.formatNumber(amount)}</td>
    <td><span class="chip chip-${status}">${chip(status)}</span></td>
    <td class="act-cell">${status === "pending" ?
      `<button class="act-approve" onclick="this.disabled=true;setStatus(this,'approved');">Approve</button> <button class="act-reject" onclick="this.disabled=true;setStatus(this,'rejected');">Reject</button>` :
      `<button class="act-hold" onclick="this.disabled=true;setStatus(this,'pending');">Hold</button>`}</td>
  </tr>`;
}

function drawCompanyRow(c) {
  const name = c.name || 'N/A';
  const type = c.type || 'N/A';
  const claims = c.claims || 0;
  const limit = c.limit || 0;

  return `
    <div class="company-card" data-id="${c.id}" data-status="${c.status || 'active'}">
      <div class="cc-header">
        <div class="cc-logo" style="background:${c.color || '#eee'}">${c.init || 'CO'}</div>
        <div style="flex:1"><div class="cc-name">${name}</div><div class="cc-type">${type}</div></div>
        <span class="chip ${c.status === "expiring" ? "chip-expiring" : "chip-active"}">${chip(c.status || 'active')}</span>
      </div>
      <div class="cc-row">
        <div class="cc-kpi"><div class="cc-kpi-val dyn-num" data-value="${claims}">${Utils.formatNumber(claims)}</div><div class="cc-kpi-lbl">${t("claims")}</div></div>
        <div class="cc-kpi"><div class="cc-kpi-val dyn-num" data-value="${limit}">${Utils.formatNumber(limit)}</div><div class="cc-kpi-lbl">${t("limit")}</div></div>
        <div class="cc-kpi"><div class="cc-kpi-val dyn-date" data-value="${c.end || 'N/A'}" style="color:${c.status === "expiring" ? "#E65100" : "var(--teal)"}">${c.end ? Utils.formatDate(c.end) : 'N/A'}</div><div class="cc-kpi-lbl">${t("expires")}</div></div>
      </div>
    </div>`;
}

function drawApprovalRow(a) {
  const patName = a.patient || 'N/A';
  const proc = a.procedure || 'N/A';
  const ref = a.ref || 'N/A';
  const status = a.status || 'pending';

  return `<tr data-id="${ref}" data-status="${status}">
    <td style="font-weight:700;color:var(--blue)">${ref}</td>
    <td><div class="td-name"><div class="mini-avatar">${Utils.initials(patName)}</div>${patName}</div></td>
    <td class="dyn-text" data-en="${proc}" data-ar="${a.arProc || proc}">${Utils.lang === "ar" ? (a.arProc || proc) : proc}</td>
    <td><span class="chip chip-${status}">${chip(status)}</span></td>
    <td>${status === "pending" ? `<button class="act-review" onclick="this.disabled=true;openReview(this);">Review</button>` : ''}</td>
  </tr>`;
}

function drawApptRow(a) {
  const patName = a.patient || 'N/A';
  const enDoc = a.doctor || 'N/A';
  const arDoc = a.arDoc || enDoc;
  const time = a.time || 'N/A';
  const status = a.status || 'unknown';

  return `<tr data-id="${a.id}" data-status="${status}">
    <td>${Utils.formatTime(time)}</td>
    <td><div class="td-name"><div class="mini-avatar">${Utils.initials(patName)}</div>${patName}</div></td>
    <td style="color:var(--muted)" class="dyn-text" data-en="${enDoc}" data-ar="${arDoc}">${Utils.lang === "ar" ? arDoc : enDoc}</td>
    <td><span class="chip chip-${status}">${chip(status)}</span></td>
  </tr>`;
}

function drawBillingRow(v) {
  const patName = v.patient || 'N/A';
  const amount = v.amount || 0;
  const status = v.status || 'pending';

  return `<tr data-id="${v.id}" data-status="${status}">
    <td style="font-weight:700;color:var(--blue)">${v.id || 'N/A'}</td>
    <td><div class="td-name"><div class="mini-avatar">${Utils.initials(patName)}</div>${patName}</div></td>
    <td style="font-weight:600" class="dyn-num" data-value="${amount}">${Utils.formatNumber(amount)}</td>
    <td><span class="chip chip-${status}">${chip(status)}</span></td>
  </tr>`;
}

// --- 📊 TABLE RENDERERS (Bulk List Rendering) ---

function renderPatients(list) {
  if (!Array.isArray(list)) {
    console.error(`Expected iterable for "renderPatients" got "${list}" of type "${typeof list}"`);
    return;
  }
  const tb = document.getElementById("pat-tbody");
  if (!tb) return;
  tb.innerHTML = list.map(p => drawPatientRow(p)).join("");
}

function renderClaims(list) {
  if (!Array.isArray(list)) {
    console.error(`Expected iterable for "renderClaims" got "${list}" of type "${typeof list}"`);
    return;
  }
  const tb = document.getElementById("claims-tbody");
  if (!tb) return;
  tb.innerHTML = list.map(c => drawClaimRow(c)).join("");
}

function renderCompanies(list) {
  if (!Array.isArray(list)) {
    console.error(`Expected iterable for "renderCompanies" got "${list}" of type "${typeof list}"`);
    return;
  }
  const tb = document.getElementById("company-grid");
  if (!tb) return;
  tb.innerHTML = list.map(c => drawCompanyRow(c)).join("");
}

function renderApprovals(list) {
  if (!Array.isArray(list)) {
    console.error(`Expected iterable for "renderApprovals" got "${list}" of type "${typeof list}"`);
    return;
  }
  const tb = document.getElementById("approvals-tbody");
  if (!tb) return;
  tb.innerHTML = list.map(a => drawApprovalRow(a)).join("");
}

function renderAppts(list) {
  if (!Array.isArray(list)) {
    console.error(`Expected iterable for "renderAppts" got "${list}" of type "${typeof list}"`);
    return;
  }
  const tb = document.getElementById("appt-tbody");
  if (!tb) return;
  tb.innerHTML = list.map(a => drawApptRow(a)).join("");
}

function renderBilling(list) {
  if (!Array.isArray(list)) {
    console.error(`Expected iterable for "renderBilling" got "${list}" of type "${typeof list}"`);
    return;
  }
  const tb = document.getElementById("bill-tbody");
  if (!tb) return;
  tb.innerHTML = list.map(v => drawBillingRow(v)).join("");
}
