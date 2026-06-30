import { Utils, syncList, escapeHTML, resolvePath } from '../core/utils.js';
import { chip, t } from '../services/translation.js';

/**
 * ==========================================
 * 🎨 RENDERING ENGINE (Visuals Only)
 * ==========================================
 * This file contains all HTML template configurations and table renderers.
 */

// --- 📋 COLUMN SCHEMAS (Decoupled Configurations) ---

export const PATIENT_COLUMNS = [
  {
    key: "name",
    render: (p) => {
      const enName = p.name || 'N/A';
      const arName = p.arName || enName;
      const nameToShow = Utils.lang === "ar" ? arName : enName;
      return `<div class="td-name"><div class="mini-avatar">${p.init || '??'}</div><span class="dyn-text" data-en="${enName}" data-ar="${arName}">${nameToShow}</span></div>`;
    }
  },
  { key: "age", class: "dyn-num" },
  {
    key: "doctor",
    render: (p) => {
      const enDoc = p.doctor || 'N/A';
      const arDoc = p.arDoc || enDoc;
      const docToShow = Utils.lang === "ar" ? arDoc : enDoc;
      return `<span class="dyn-text" data-en="${enDoc}" data-ar="${arDoc}">${docToShow}</span>`;
    },
    style: "color:var(--muted)"
  },
  { key: "ins", style: "color:var(--muted)" },
  {
    key: "date",
    render: (p) => p.date ? Utils.formatDate(p.date) : 'N/A',
    class: "dyn-date",
    style: "color:var(--muted)"
  },
  {
    key: "status",
    render: (p) => `<span class="chip chip-${p.status || 'unknown'}">${chip(p.status || 'unknown')}</span>`,
    class: "status-cell"
  }
];

export const CLAIM_COLUMNS = [
  { key: "id", style: "font-weight:700;color:var(--blue)" },
  {
    key: "patient",
    render: (c) => {
      const patName = c.patient || 'N/A';
      return `<div class="td-name"><div class="mini-avatar">${Utils.initials(patName)}</div>${patName}</div>`;
    }
  },
  {
    key: "amount",
    render: (c) => Utils.formatNumber(c.amount || 0),
    class: "dyn-num",
    style: "font-weight:600"
  },
  {
    key: "status",
    render: (c) => `<span class="chip chip-${c.status || 'pending'}">${chip(c.status || 'pending')}</span>`
  },
  {
    header: "Actions",
    render: (c) => {
      const status = c.status || 'pending';
      return status === "pending" ?
        `<button class="act-approve" data-action="approve">Approve</button> <button class="act-reject" data-action="reject">Reject</button>` :
        `<button class="act-hold" data-action="hold">Hold</button>`;
    },
    class: "act-cell"
  }
];

export const APPROVAL_COLUMNS = [
  { key: "ref", style: "font-weight:700;color:var(--blue)" },
  {
    key: "patient",
    render: (a) => {
      const patName = a.patient || 'N/A';
      return `<div class="td-name"><div class="mini-avatar">${Utils.initials(patName)}</div>${patName}</div>`;
    }
  },
  {
    key: "procedure",
    render: (a) => {
      const proc = a.procedure || 'N/A';
      const arProc = a.arProc || proc;
      const procToShow = Utils.lang === "ar" ? arProc : proc;
      return `<span class="dyn-text" data-en="${proc}" data-ar="${arProc}">${procToShow}</span>`;
    },
    class: "dyn-text"
  },
  {
    key: "status",
    render: (a) => `<span class="chip chip-${a.status || 'pending'}">${chip(a.status || 'pending')}</span>`
  },
  {
    header: "Actions",
    render: (a) => {
      const status = a.status || 'pending';
      return status === "pending" ? `<button class="act-review" data-action="review">Review</button>` : '';
    }
  }
];

export const APPT_COLUMNS = [
  {
    key: "time",
    render: (a) => Utils.formatTime(a.time)
  },
  {
    key: "patient",
    render: (a) => {
      const patName = a.patient || 'N/A';
      return `<div class="td-name"><div class="mini-avatar">${Utils.initials(patName)}</div>${patName}</div>`;
    }
  },
  {
    key: "doctor",
    render: (a) => {
      const enDoc = a.doctor || 'N/A';
      const arDoc = a.arDoc || enDoc;
      const docToShow = Utils.lang === "ar" ? arDoc : enDoc;
      return `<span class="dyn-text" data-en="${enDoc}" data-ar="${arDoc}">${docToShow}</span>`;
    },
    style: "color:var(--muted)"
  },
  {
    key: "status",
    render: (a) => `<span class="chip chip-${a.status || 'unknown'}">${chip(a.status || 'unknown')}</span>`
  }
];

export const BILLING_COLUMNS = [
  { key: "id", style: "font-weight:700;color:var(--blue)" },
  {
    key: "patient",
    render: (v) => {
      const patName = v.patient || 'N/A';
      return `<div class="td-name"><div class="mini-avatar">${Utils.initials(patName)}</div>${patName}</div>`;
    }
  },
  {
    key: "amount",
    render: (v) => Utils.formatNumber(v.amount || 0),
    class: "dyn-num",
    style: "font-weight:600"
  },
  {
    key: "status",
    render: (v) => `<span class="chip chip-${v.status || 'pending'}">${chip(v.status || 'pending')}</span>`
  }
];

// --- 🧱 LEGACY COMPATIBILITY WRAPPERS (Direct Row Layouts) ---

export function drawPatientRow(p) {
  const attrs = {
    "class": "clickable-row",
    "data-id": p.id,
    "data-status": p.status || "active",
    "onclick": `viewPatient('${p.id}')`
  };
  const attrStr = Object.entries(attrs).map(([key, val]) => `${key}="${val}"`).join(" ");
  const cells = PATIENT_COLUMNS.map(col => {
    const classStr = col.class ? ` class="${col.class}"` : "";
    const styleStr = col.style ? ` style="${col.style}"` : "";
    const rawVal = col.render ? col.render(p) : resolvePath(p, col.key);
    const content = col.render ? rawVal : escapeHTML(rawVal);
    return `<td data-col="${col.key || col.header}"${classStr}${styleStr}>${content}</td>`;
  }).join("");
  return `<tr ${attrStr}>${cells}</tr>`;
}

export function drawClaimRow(c) {
  const attrs = {
    "data-id": c.id,
    "data-status": c.status || "pending"
  };
  const attrStr = Object.entries(attrs).map(([key, val]) => `${key}="${val}"`).join(" ");
  const cells = CLAIM_COLUMNS.map(col => {
    const classStr = col.class ? ` class="${col.class}"` : "";
    const styleStr = col.style ? ` style="${col.style}"` : "";
    const rawVal = col.render ? col.render(c) : resolvePath(c, col.key);
    const content = col.render ? rawVal : escapeHTML(rawVal);
    return `<td data-col="${col.key || col.header}"${classStr}${styleStr}>${content}</td>`;
  }).join("");
  return `<tr ${attrStr}>${cells}</tr>`;
}

export function drawCompanyRow(c) {
  const name = c.name || 'N/A';
  const type = c.type || 'N/A';
  const claims = c.claims || 0;
  const limit = c.limit || 0;

  return `
    <div class="company-card" data-key="${c.id}" data-status="${c.status || 'active'}">
      <div class="cc-header">
        <div class="cc-logo" style="background:${c.color || '#eee'}">${c.init || 'CO'}</div>
        <div style="flex:1"><div class="cc-name">${name}</div><div class="cc-type">${type}</div></div>
        <span class="chip ${c.status === "expiring" ? "chip-expiring" : "chip-active"}">${chip(c.status || 'active')}</span>
      </div>
      <div class="cc-row">
        <div class="cc-kpi"><div class="cc-kpi-val dyn-num" data-col="claims">${Utils.formatNumber(claims)}</div><div class="cc-kpi-lbl">${t("claims")}</div></div>
        <div class="cc-kpi"><div class="cc-kpi-val dyn-num" data-col="limit">${Utils.formatNumber(limit)}</div><div class="cc-kpi-lbl">${t("limit")}</div></div>
        <div class="cc-kpi"><div class="cc-kpi-val dyn-date" data-col="expires" style="color:${c.status === "expiring" ? "#E65100" : "var(--teal)"}">${c.end ? Utils.formatDate(c.end) : 'N/A'}</div><div class="cc-kpi-lbl">${t("expires")}</div></div>
      </div>
    </div>`;
}

export function drawApprovalRow(a) {
  const attrs = {
    "data-id": a.ref || "N/A",
    "data-status": a.status || "pending"
  };
  const attrStr = Object.entries(attrs).map(([key, val]) => `${key}="${val}"`).join(" ");
  const cells = APPROVAL_COLUMNS.map(col => {
    const classStr = col.class ? ` class="${col.class}"` : "";
    const styleStr = col.style ? ` style="${col.style}"` : "";
    const rawVal = col.render ? col.render(a) : resolvePath(a, col.key);
    const content = col.render ? rawVal : escapeHTML(rawVal);
    return `<td data-col="${col.key || col.header}"${classStr}${styleStr}>${content}</td>`;
  }).join("");
  return `<tr ${attrStr}>${cells}</tr>`;
}

export function drawApptRow(a) {
  const attrs = {
    "data-id": a.id,
    "data-status": a.status || "unknown"
  };
  const attrStr = Object.entries(attrs).map(([key, val]) => `${key}="${val}"`).join(" ");
  const cells = APPT_COLUMNS.map(col => {
    const classStr = col.class ? ` class="${col.class}"` : "";
    const styleStr = col.style ? ` style="${col.style}"` : "";
    const rawVal = col.render ? col.render(a) : resolvePath(a, col.key);
    const content = col.render ? rawVal : escapeHTML(rawVal);
    return `<td data-col="${col.key || col.header}"${classStr}${styleStr}>${content}</td>`;
  }).join("");
  return `<tr ${attrStr}>${cells}</tr>`;
}

export function drawBillingRow(v) {
  const attrs = {
    "data-id": v.id,
    "data-status": v.status || "pending"
  };
  const attrStr = Object.entries(attrs).map(([key, val]) => `${key}="${val}"`).join(" ");
  const cells = BILLING_COLUMNS.map(col => {
    const classStr = col.class ? ` class="${col.class}"` : "";
    const styleStr = col.style ? ` style="${col.style}"` : "";
    const rawVal = col.render ? col.render(v) : resolvePath(v, col.key);
    const content = col.render ? rawVal : escapeHTML(rawVal);
    return `<td data-col="${col.key || col.header}"${classStr}${styleStr}>${content}</td>`;
  }).join("");
  return `<tr ${attrStr}>${cells}</tr>`;
}


// --- 📊 TABLE RENDERERS (Bulk List Rendering using syncList) ---

export function renderPatients(list) {
  if (list === undefined || list === null) return;
  if (!Array.isArray(list)) return;
  const tb = document.getElementById("pat-tbody");
  if (!tb) return;
  if (list.length === 0) {
    tb.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 40px; color: var(--muted)">No patients found.</td></tr>`;
    return;
  }
  syncList(tb, list, {
    getKey: (p) => p.id,
    columns: PATIENT_COLUMNS,
    rowAttrs: (p) => ({
      class: "clickable-row",
      "data-status": p.status || "active"
    }),
    actions: {
      // Event delegation routes edit clicks to viewPatient
      edit: (id) => { if (window.viewPatient) window.viewPatient(id); }
    }
  });

  // Enable click handler fallback for standard row clicks in Edit Mode
  tb.querySelectorAll("tr").forEach(tr => {
    if (!tr.dataset.hasListener) {
      tr.dataset.hasListener = "true";
      tr.addEventListener("click", (e) => {
        if (e.target.closest("button") || e.target.closest("select") || e.target.closest("input")) return;
        if (window.viewPatient) window.viewPatient(tr.dataset.key);
      });
    }
  });
}

export function renderHomePatients(list) {
  if (list === undefined || list === null) return;
  if (!Array.isArray(list)) return;
  const tb = document.getElementById("home-tbody");
  if (!tb) return;
  if (list.length === 0) {
    tb.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 40px; color: var(--muted)">No patients found.</td></tr>`;
    return;
  }
  const sliced = list.slice(0, 3);
  syncList(tb, sliced, {
    getKey: (p) => p.id,
    columns: PATIENT_COLUMNS,
    rowAttrs: (p) => ({
      class: "clickable-row",
      "data-status": p.status || "active"
    })
  });

  tb.querySelectorAll("tr").forEach(tr => {
    if (!tr.dataset.hasListener) {
      tr.dataset.hasListener = "true";
      tr.addEventListener("click", (e) => {
        if (e.target.closest("button") || e.target.closest("select") || e.target.closest("input")) return;
        if (window.viewPatient) window.viewPatient(tr.dataset.key);
      });
    }
  });
}

export function renderClaims(list) {
  if (list === undefined || list === null) return;
  if (!Array.isArray(list)) return;
  const tb = document.getElementById("claims-tbody");
  if (!tb) return;
  if (list.length === 0) {
    tb.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px; color: var(--muted)">No claims found.</td></tr>`;
    return;
  }
  syncList(tb, list, {
    getKey: (c) => c.id,
    columns: CLAIM_COLUMNS,
    rowAttrs: (c) => ({
      "data-status": c.status || "pending"
    }),
    actions: {
      approve: (id, btn) => { btn.disabled = true; if (window.setStatus) window.setStatus(btn, 'approved'); },
      reject: (id, btn) => { btn.disabled = true; if (window.setStatus) window.setStatus(btn, 'rejected'); },
      hold: (id, btn) => { btn.disabled = true; if (window.setStatus) window.setStatus(btn, 'pending'); }
    }
  });
}

export function renderCompanies(list) {
  if (list === undefined || list === null) return;
  if (!Array.isArray(list)) return;
  const parent = document.getElementById("company-grid");
  if (!parent) return;
  if (list.length === 0) {
    parent.innerHTML = `<div style="text-align:center; grid-column: 1/-1; padding: 40px; color: var(--muted)">No companies found.</div>`;
    return;
  }

  syncList(parent, list, {
    getKey: (c) => c.id,
    createEl: (c) => {
      const card = document.createElement("div");
      card.className = "company-card";
      card.setAttribute("data-status", c.status || "active");
      card.innerHTML = `
        <div class="cc-header">
          <div class="cc-logo" style="background:${c.color || '#eee'}">${c.init || 'CO'}</div>
          <div style="flex:1"><div class="cc-name">${c.name || 'N/A'}</div><div class="cc-type">${c.type || 'N/A'}</div></div>
          <span class="chip ${c.status === "expiring" ? "chip-expiring" : "chip-active"}">${chip(c.status || 'active')}</span>
        </div>
        <div class="cc-row">
          <div class="cc-kpi"><div class="cc-kpi-val dyn-num" data-col="claims">${Utils.formatNumber(c.claims || 0)}</div><div class="cc-kpi-lbl">${t("claims")}</div></div>
          <div class="cc-kpi"><div class="cc-kpi-val dyn-num" data-col="limit">${Utils.formatNumber(c.limit || 0)}</div><div class="cc-kpi-lbl">${t("limit")}</div></div>
          <div class="cc-kpi"><div class="cc-kpi-val dyn-date" data-col="expires" style="color:${c.status === "expiring" ? "#E65100" : "var(--teal)"}">${c.end ? Utils.formatDate(c.end) : 'N/A'}</div><div class="cc-kpi-lbl">${t("expires")}</div></div>
        </div>`;
      return card;
    },
    updateEl: (card, c) => {
      card.setAttribute("data-status", c.status || "active");
      const chipEl = card.querySelector(".cc-header .chip");
      if (chipEl) {
        chipEl.className = `chip ${c.status === "expiring" ? "chip-expiring" : "chip-active"}`;
        chipEl.textContent = chip(c.status || 'active');
      }
      const claimsEl = card.querySelector('[data-col="claims"]');
      if (claimsEl) claimsEl.textContent = Utils.formatNumber(c.claims || 0);

      const limitEl = card.querySelector('[data-col="limit"]');
      if (limitEl) limitEl.textContent = Utils.formatNumber(c.limit || 0);

      const expiresEl = card.querySelector('[data-col="expires"]');
      if (expiresEl) {
        expiresEl.textContent = c.end ? Utils.formatDate(c.end) : 'N/A';
        expiresEl.style.color = c.status === "expiring" ? "#E65100" : "var(--teal)";
      }
    }
  });
}

export function renderApprovals(list) {
  if (list === undefined || list === null) return;
  if (!Array.isArray(list)) return;
  const tb = document.getElementById("approvals-tbody");
  if (!tb) return;
  if (list.length === 0) {
    tb.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 40px; color: var(--muted)">No pending approvals found.</td></tr>`;
    return;
  }
  syncList(tb, list, {
    getKey: (a) => a.ref,
    columns: APPROVAL_COLUMNS,
    rowAttrs: (a) => ({
      "data-status": a.status || "pending"
    }),
    actions: {
      review: (id, btn) => { btn.disabled = true; if (window.openReview) window.openReview(btn); }
    }
  });
}

export function renderAppts(list) {
  if (list === undefined || list === null) return;
  if (!Array.isArray(list)) return;
  const tb = document.getElementById("appt-tbody");
  if (!tb) return;
  if (list.length === 0) {
    tb.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 40px; color: var(--muted)">No appointments scheduled for today.</td></tr>`;
    return;
  }
  syncList(tb, list, {
    getKey: (a) => a.id,
    columns: APPT_COLUMNS,
    rowAttrs: (a) => ({
      "data-status": a.status || "unknown"
    })
  });
}

export function renderBilling(list) {
  if (list === undefined || list === null) return;
  if (!Array.isArray(list)) return;
  const tb = document.getElementById("bill-tbody");
  if (!tb) return;
  if (list.length === 0) {
    tb.innerHTML = `<tr><td colspan="4" style="text-align:center; padding: 40px; color: var(--muted)">No invoices found.</td></tr>`;
    return;
  }
  syncList(tb, list, {
    getKey: (v) => v.id,
    columns: BILLING_COLUMNS,
    rowAttrs: (v) => ({
      "data-status": v.status || "pending"
    })
  });
}
