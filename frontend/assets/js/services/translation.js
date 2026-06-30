import { T } from './translations-table.js';
import { Utils } from '../core/utils.js';

// --- OPTIMIZED TRANSLATION ENGINE ---

function d() { return T[Utils.lang]; }

export function chip(k) {
  const chipsObj = d().chips;
  return (chipsObj && chipsObj[k]) ? chipsObj[k] : k;
}

export function t(k) {
  return d()[k] || k;
}

export function applyLang() {
  const dictionary = d();
  document.documentElement.dir = dictionary.dir;
  document.documentElement.lang = Utils.lang;

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

    if (el.hasAttribute('title')) {
      el.setAttribute('title', translation);
    }
  });

  // --- DOM-BASED DYNAMIC TRANSLATION ---
  
  // 1. Numbers (Cards, Badges, Table Cells)
  document.querySelectorAll('.stat-val, .sb-val, .badge, .dyn-num').forEach(el => {
    const rawData = el.getAttribute('data-value');
    if (!rawData || rawData === "." || rawData === "-" || rawData === "N/A") return; 
    
    const rawNumber = parseInt(rawData, 10);
    if (!isNaN(rawNumber)) {
        el.textContent = Utils.formatNumber(rawNumber);
    }
  });

  // 2. Dates (Table Cells)
  document.querySelectorAll('.dyn-date').forEach(el => {
      const rawDate = el.getAttribute('data-value');
      if (rawDate && rawDate !== "." && rawDate !== "-" && rawDate !== "N/A") {
          el.textContent = Utils.formatDate(rawDate);
      }
  });

  // 3. Bilingual Text (Names, Roles)
  document.querySelectorAll('.dyn-text').forEach(el => {
      const text = el.getAttribute(`data-${Utils.lang}`);
      if (text) el.textContent = text;
  });
}

export function toggleLang() {
  // 1. Flip Language & Save
  const newLocale = Utils.lang === "en" ? "ar-EG" : "en-US";
  localStorage.setItem("locale", newLocale);
  
  // 2. DOM-Based Translation (No Re-renders needed!)
  applyLang();
}
