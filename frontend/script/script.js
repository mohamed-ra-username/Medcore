const role = localStorage.getItem("role");

subdomain="api"
domainName="localhost"
port="5001"
api_url = `http://${subdomain}.${domainName}:${port}`

var companies,claimsData,approvalsData,homePatients,appts,approvalRows
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

async function GetDataFromBackend(endpoint) {
  try {
    const response = await fetch(api_url + endpoint);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    var data = await response.json();
    return data

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

const T = {
  en: {
    dir: "ltr", langBtn: "🌐 العربية",
    "lbl-main": "Main", "lbl-insurance": "Insurance", "lbl-finance": "Finance", "lbl-sys": "System",
    "nav-home": "Home", "nav-patients": "Patients", "nav-appt": "Appointments",
    "nav-ins": "Insurance Companies", "nav-claims": "Claims", "nav-approvals": "Approvals Review",
    "nav-billing": "Billing & Payments", "nav-reports": "Reports", "nav-settings": "Settings",
    "su-name": "Dr. Ahmed", "su-role": "Administrator",
    "home-title": "Dashboard Overview", "home-sub": "Monday, 5 May 2026", "home-addbtn": "New Patient", "home-recent": "Recent Patients", "home-search": "Search...",
    "s1": "Total Patients", "s1t": "↑ 12% this month", "s2": "Today's Appts", "s2t": "↑ 3 from yesterday", "s3": "Pending Claims", "s3t": "Needs action", "s4": "Revenue (EGP)", "s4t": "↑ 8% this week",
    "ht1": "Patient", "ht2": "Age", "ht3": "Doctor", "ht4": "Insurance", "ht5": "Date", "ht6": "Status",
    "ins-title": "Insurance Companies", "ins-sub": "Manage contracts & coverage", "ins-addbtn": "Add Company",
    "sb-total": "Total Partners", "sb-active": "Active Contracts", "sb-expiring": "Expiring Soon", "sb-claims-total": "Total Claims",
    "ins-card-title": "All Companies", "ft-all": "All", "ft-active": "Active", "ft-exp": "Expiring",
    "claims-title": "Claims Management", "claims-sub": "Review and close insurance claims", "claims-addbtn": "New Claim",
    "c-pending-lbl": "Pending", "c-approved-lbl": "Approved", "c-rejected-lbl": "Rejected", "c-amount-lbl": "Total EGP",
    "claims-card-title": "All Claims", "claims-search": "Search...", "cft-pending": "Pending", "cft-approved": "Approved", "cft-rejected": "Rejected",
    "cl1": "Claim #", "cl2": "Patient", "cl3": "Insurance Co.", "cl4": "Amount (EGP)", "cl5": "Date", "cl6": "Status", "cl7": "Action",
    "appr-title": "Approvals Review", "appr-sub": "Pending authorizations from insurance companies",
    "appr-card-title": "Pending Approvals", "appr-approve-all": "✓ Approve All", "appr-search": "Search...",
    "ap1": "Ref #", "ap2": "Patient", "ap3": "Procedure", "ap4": "Insurance Co.", "ap5": "Requested", "ap6": "Amount (EGP)", "ap7": "Action",
    "pat-title": "Patients", "pat-sub": "All registered patients", "pat-addbtn": "+ New Patient", "pat-list": "Patient List",
    "appt-title": "Appointments", "appt-sub": "Today's schedule", "appt-addbtn": "+ New Appointment",
    "bill-title": "Billing & Payments", "bill-sub": "Invoices and payment tracking", "bill-addbtn": "+ New Invoice",
    "bill-s1": "Total Revenue", "bill-s2": "Collected", "bill-s3": "Insurance Due", "bill-s4": "Overdue", "bill-card-title": "Recent Invoices",
    "rep-title": "Reports", "set-title": "Settings",
    "m-addco-title": "Add Insurance Company", "m-coname": "Company Name", "m-cotype": "Type", "m-costart": "Contract Start", "m-coend": "Contract End", "m-colimit": "Coverage Limit (EGP)", "m-cocontact": "Contact Person", "m-cancel": "Cancel", "m-save": "Save Company",
    "m-addcl-title": "New Claim", "m-clpat": "Patient", "m-clins": "Insurance Company", "m-clamt": "Amount (EGP)", "m-cldate": "Service Date", "m-clnotes": "Notes", "m-cancel2": "Cancel", "m-save2": "Submit Claim",
    "m-addpat-title": "New Patient", "m-patname": "Name", "m-patage": "Age", "m-patphone": "Phone Number", "m-patwa": "Whatsapp Number", "m-patnid": "National ID", "m-patins": "Insurance Company", "m-patins2": "Secondary Insurance", "m-patdoc": "Doctor", "m-cancel3": "Cancel", "m-save3": "Save Patient",
    "m-editpat-title": "Patient Details", "m-epatname": "Name", "m-epatage": "Age", "m-epatphone": "Phone Number", "m-epatwa": "Whatsapp Number", "m-epatnid": "National ID", "m-epatins": "Insurance Company", "m-epatins2": "Secondary Insurance", "m-epatdoc": "Doctor", "m-edel": "Delete Patient", "m-eedit": "Edit", "m-esave": "Save Changes",
    chips: { active: "Active", done: "Done", pending: "Pending", approved: "Approved", rejected: "Rejected", expiring: "Expiring" },
    approve: "Approve", reject: "Reject", view: "View",
    claims: "Claims", expires: "Expires", limit: "Limit EGP", noPending: "No pending approvals",
  },
  ar: {
    dir: "rtl", langBtn: "🌐 English",
    "lbl-main": "رئيسي", "lbl-insurance": "التأمين", "lbl-finance": "المالية", "lbl-sys": "النظام",
    "nav-home": "الرئيسية", "nav-patients": "المرضى", "nav-appt": "المواعيد",
    "nav-ins": "شركات التأمين", "nav-claims": "المطالبات", "nav-approvals": "مراجعة الموافقات",
    "nav-billing": "الحسابات والمدفوعات", "nav-reports": "التقارير", "nav-settings": "الإعدادات",
    "su-name": "د. أحمد", "su-role": "مسؤول النظام",
    "home-title": "نظرة عامة", "home-sub": "الاثنين، 5 مايو 2026", "home-addbtn": "مريض جديد", "home-recent": "أحدث المرضى", "home-search": "بحث...",
    "s1": "إجمالي المرضى", "s1t": "↑ 12% هذا الشهر", "s2": "مواعيد اليوم", "s2t": "↑ 3 من أمس", "s3": "مطالبات معلقة", "s3t": "تحتاج إجراء", "s4": "الإيرادات (جنيه)", "s4t": "↑ 8% هذا الأسبوع",
    "ht1": "المريض", "ht2": "العمر", "ht3": "الدكتور", "ht4": "التأمين", "ht5": "التاريخ", "ht6": "الحالة",
    "ins-title": "شركات التأمين", "ins-sub": "إدارة العقود والتغطية", "ins-addbtn": "إضافة شركة",
    "sb-total": "إجمالي الشركاء", "sb-active": "عقود نشطة", "sb-expiring": "تنتهي قريباً", "sb-claims-total": "إجمالي المطالبات",
    "ins-card-title": "جميع الشركات", "ft-all": "الكل", "ft-active": "النشطة", "ft-exp": "المنتهية قريباً",
    "claims-title": "إدارة المطالبات", "claims-sub": "مراجعة وتقفيل مطالبات التأمين", "claims-addbtn": "مطالبة جديدة",
    "c-pending-lbl": "معلقة", "c-approved-lbl": "موافق عليها", "c-rejected-lbl": "مرفوضة", "c-amount-lbl": "إجمالي جنيه",
    "claims-card-title": "جميع المطالبات", "claims-search": "بحث...", "cft-pending": "معلقة", "cft-approved": "موافق عليها", "cft-rejected": "مرفوضة",
    "cl1": "رقم المطالبة", "cl2": "المريض", "cl3": "شركة التأمين", "cl4": "المبلغ (جنيه)", "cl5": "التاريخ", "cl6": "الحالة", "cl7": "إجراء",
    "appr-title": "مراجعة الموافقات", "appr-sub": "موافقات معلقة من شركات التأمين",
    "appr-card-title": "الموافقات المعلقة", "appr-approve-all": "✓ موافقة على الكل", "appr-search": "بحث...",
    "ap1": "رقم المرجع", "ap2": "المريض", "ap3": "الإجراء", "ap4": "شركة التأمين", "ap5": "تاريخ الطلب", "ap6": "المبلغ (جنيه)", "ap7": "إجراء",
    "pat-title": "المرضى", "pat-sub": "جميع المرضى المسجلين", "pat-addbtn": "+ مريض جديد", "pat-list": "قائمة المرضى",
    "appt-title": "المواعيد", "appt-sub": "جدول اليوم", "appt-addbtn": "+ موعد جديد",
    "bill-title": "الحسابات والمدفوعات", "bill-sub": "الفواتير ومتابعة المدفوعات", "bill-addbtn": "+ فاتورة جديدة",
    "bill-s1": "إجمالي الإيرادات", "bill-s2": "المحصّل", "bill-s3": "مستحق من التأمين", "bill-s4": "متأخر السداد", "bill-card-title": "أحدث الفواتير",
    "rep-title": "التقارير", "set-title": "الإعدادات",
    "m-addco-title": "إضافة شركة تأمين", "m-coname": "اسم الشركة", "m-cotype": "النوع", "m-costart": "بداية العقد", "m-coend": "نهاية العقد", "m-colimit": "حد التغطية (جنيه)", "m-cocontact": "شخص الاتصال", "m-cancel": "إلغاء", "m-save": "حفظ الشركة",
    "m-addcl-title": "مطالبة جديدة", "m-clpat": "المريض", "m-clins": "شركة التأمين", "m-clamt": "المبلغ (جنيه)", "m-cldate": "تاريخ الخدمة", "m-clnotes": "ملاحظات", "m-cancel2": "إلغاء", "m-save2": "إرسال المطالبة",
    "m-addpat-title": "مريض جديد", "m-patname": "الاسم", "m-patage": "العمر", "m-patphone": "رقم الهاتف", "m-patwa": "رقم الواتساب", "m-patnid": "الرقم القومي", "m-patins": "شركة التأمين", "m-patins2": "تأمين ثانوي", "m-patdoc": "الدكتور", "m-cancel3": "إلغاء", "m-save3": "حفظ المريض",
    "m-editpat-title": "تفاصيل المريض", "m-epatname": "الاسم", "m-epatage": "العمر", "m-epatphone": "رقم الهاتف", "m-epatwa": "رقم الواتساب", "m-epatnid": "الرقم القومي", "m-epatins": "شركة التأمين", "m-epatins2": "تأمين ثانوي", "m-epatdoc": "الدكتور", "m-edel": "حذف المريض", "m-eedit": "تعديل", "m-esave": "حفظ التغييرات",
    chips: { active: "نشط", done: "منتهي", pending: "معلق", approved: "موافق", rejected: "مرفوض", expiring: "تنتهي قريباً" },
    approve: "موافقة", reject: "رفض", view: "عرض",
    claims: "مطالبات", expires: "ينتهي", limit: "حد التغطية", noPending: "لا توجد موافقات معلقة",
  }
};

let lang = "en", claimFilter = "all", companyFilter = "all";

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
  renderHome(); renderCompanies(); renderClaims(); renderApprovals(); renderPatients(); renderAppts(); renderBilling();
}
function toggleLang() { lang = lang === "en" ? "ar" : "en"; applyLang(); }

function initials(name) { return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() }

async function renderHome() {
  const tb = document.getElementById("home-tbody");
  homePatients = await GetDataFromBackend("/homePatients/")

  if (tb === null) { return }
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
  approvalRows = approvalsData.map(a => ({ ...a, status: "pending" }));


  const pending = approvalRows.filter(a => a.status === "pending");
  ap_badge = document.getElementById("approvals-badge")
  if (ap_badge === null) { return }
  ap_badge.textContent = pending.length || "0";
  if (!pending.length) { tb.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:30px;color:var(--muted)">✓ ${t("noPending")}</td></tr>`; return; }
  if (tb===null)
  {return}
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
  const phones = ["010-1234-5678", "012-9876-5432", "011-5555-1234", "010-8888-7777", "012-3333-2222"];
  homePatients = await GetDataFromBackend("/homePatients/")

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
  const phones = ["010-1234-5678", "012-9876-5432", "011-5555-1234", "010-8888-7777", "012-3333-2222"];

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

  if (tb === null) { return }
  tb.innerHTML = appts.map(a => `<tr>
    <td style="font-weight:700">${a.time}</td><td>${a.patient}</td>
    <td style="color:var(--muted)">${a.doctor}</td><td>${a.type}</td>
    <td><span class="chip chip-${a.status}">${chip(a.status)}</span></td>
  </tr>`).join("");
}

function renderBilling() {
  const tb = document.getElementById("bill-tbody");
  const invoices = [
    { id: "INV-1042", patient: "Ahmed Hassan", date: "May 4", amount: "3,200", ins: "Misr Insurance", status: "pending" },
    { id: "INV-1041", patient: "Sara Khalil", date: "May 4", amount: "1,800", ins: "AXA Egypt", status: "done" },
    { id: "INV-1040", patient: "Mohamed Ali", date: "May 3", amount: "5,600", ins: "MetLife Egypt", status: "pending" },
    { id: "INV-1039", patient: "Laila Omar", date: "May 3", amount: "2,100", ins: "Allianz Egypt", status: "done" },
    { id: "INV-1038", patient: "Youssef", date: "May 2", amount: "4,300", ins: "GlobeMed", status: "rejected" },
  ];
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