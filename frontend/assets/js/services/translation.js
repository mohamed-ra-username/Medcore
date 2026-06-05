// --- OPTIMIZED TRANSLATION ENGINE ---

function d() { return T[lang]; }

function chip(k) {
  const chipsObj = d().chips;
  return (chipsObj && chipsObj[k]) ? chipsObj[k] : k;
}

function t(k) {
  return d()[k] || k;
}

function applyLang() {
  const dictionary = d();
  document.documentElement.dir = dictionary.dir;
  document.documentElement.lang = lang;

  // Use lowercase 'data-langid' because HTML dataset attributes cast to lowercase
  document.querySelectorAll('[data-langid]').forEach(el => {
    const key = el.getAttribute('data-langid');
    if (!key) return;

    const translation = dictionary[key];
    if (translation === undefined) return;

    const tag = el.tagName.toUpperCase();

    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      el.placeholder = translation;
    } else if (tag === 'OPTION') {
      el.textContent = translation;
    } else {
      el.textContent = translation;
    }

    // Safely translate tooltips/titles if they exist
    if (el.hasAttribute('title')) {
      el.setAttribute('title', translation);
    }
  });

  // This formatter will automatically use Eastern Arabic numerals for "ar-EG"
  document.querySelectorAll('[class$="val"]').forEach(el => {
    // Always grab the raw number from the data attribute (default to 0)
    const rawNumber = parseInt(el.getAttribute('data-value'), 10);

    // Format and update the UI
    el.textContent = numberFormatter.format(rawNumber);
  });
}

function toggleLang() {
  // 1. Flip Language & Save
  lang = lang === "en" ? "ar" : "en";
  locale = lang === "ar" ? "ar-EG" : "en-US";
  numberFormatter = new Intl.NumberFormat(locale);
  localStorage.setItem("lang", lang);
  // 2. Translate Static HTML
  applyLang();

  // 3. Translate Dynamic JS Injections (Force Re-render of Active Page)
  const activePage = document.querySelector(".page.active");
  if (activePage) {
    const pageId = activePage.id;
    if (pageId === "page-home") renderHome();
    else if (pageId === "page-insurance") renderCompanies();
    else if (pageId === "page-claims") renderClaims();
    else if (pageId === "page-approvals") renderApprovals();
    else if (pageId === "page-patients") renderPatients();
    else if (pageId === "page-appointments") renderAppts();
    else if (pageId === "page-billing") renderBilling();
  }


}

// ------------------------------------
