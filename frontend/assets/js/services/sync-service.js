import { GETRequest } from '../core/api-client.js';

/**
 * ==========================================
 * 📢 THE RADIO STATION (Data Fetcher)
 * ==========================================
 * Fetches data and broadcasts "Shouts" (Events) to the app.
 */

const ENDPOINTS = [
  { url: "/patients/", event: "medcore:patients_updated" },
  { url: "/statistics/", event: "medcore:statistics_updated" },
  { url: "/appointments/", event: "medcore:appts_updated" },
  { url: "/companies/", event: "medcore:companies_updated" },
  { url: "/claims/", event: "medcore:claims_updated" },
  { url: "/approvals/", event: "medcore:approvals_updated" },
  { url: "/invoices/", event: "medcore:billing_updated" }
];

async function fetchAndBroadcast(ep) {
  try {
    const res = await GETRequest(ep.url);
    if (res && res.success) {
      broadcast(ep.event, res.data);
    }
  } catch (error) {
    console.error(`Fetch failed for ${ep.url}:`, error);
  }
}

export async function syncData() {
  // Fetch all collections in parallel in background
  ENDPOINTS.forEach(ep => fetchAndBroadcast(ep));
}

function broadcast(eventName, data) {
  if (!data) return;
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}
