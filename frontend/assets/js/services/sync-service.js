/**
 * ==========================================
 * 📢 THE RADIO STATION (Data Fetcher)
 * ==========================================
 * Fetches data and broadcasts "Shouts" (Events) to the app.
 */
const update_time = 10 * 60 * 1000; // 1 minute
// const update_time = 5 * 1000; // 5 seconds

var homePatients, companies, claimsData, approvalsData,  appts, invoices, stats, statistics;


async function update() {
  try {
    console.info("📡 Broadcaster: Fetching fresh data...");

    const results = await Promise.all([
      GETRequest("/homePatients/"),
      GETRequest("/companies/"),
      GETRequest("/claims/"),
      GETRequest("/approvals/"),
      GETRequest("/appointments/"),
      GETRequest("/invoices/"),
      GETRequest("/stats/"),
      GETRequest("/statistics/")
    ]);

    console.log("📊 Broadcaster: Data fetched successfully.");
    // Extract data from standard envelopes
    const [p, c, cl, a, ap, inv, st, sttc] = results.map(res => (res && res.success) ? res.data : undefined);

    // Update global state
    homePatients = p;
    companies = c;
    claimsData = cl;
    approvalsData = a;
    appts = ap;
    invoices = inv;
    stats = st;
    statistics = sttc;

    // 🛑 WAIT FOR UI TO BE READY
    if (!window.isUIReady) {
      console.warn("⌛ Broadcaster: UI not ready. Waiting for signal...");
      await new Promise(resolve => {
        document.addEventListener("medcore:ui_ready", resolve, { once: true });
      });
    }

    // 📢 BROADCAST EVENTS
    broadcast("medcore:patients_updated", homePatients);
    broadcast("medcore:stats_updated", stats);
    broadcast("medcore:statistics_updated", statistics);
    broadcast("medcore:claims_updated", claimsData);
    broadcast("medcore:companies_updated", companies);
    broadcast("medcore:approvals_updated", approvalsData);
    broadcast("medcore:appts_updated", appts);
    broadcast("medcore:billing_updated", invoices);

    console.info("✅ Broadcaster: All signals sent.");

  } catch (error) {
    console.error("❌ Broadcaster Error:", error);
  }

  // !Refresh interval
  // setTimeout(update, update_time);
}

function broadcast(eventName, data) {
  if (!data) return;
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}

// Start the broadcast loop
update();
