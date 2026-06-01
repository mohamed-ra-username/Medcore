async function updateAllDashboards() {
  const stats = await GetDataFromBackend("/stats/");
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
