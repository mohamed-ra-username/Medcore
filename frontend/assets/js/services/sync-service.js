/**
 * ==========================================
 * 📢 THE RADIO STATION (Data Fetcher)
 * ==========================================
 * Fetches data and broadcasts "Shouts" (Events) to the app.
 */

var homePatients, companies, claimsData, approvalsData, phones, appts, invoices, stats;

async function update() {
  try {
    console.info("📡 Broadcaster: Fetching fresh data...");
    
    const results = await Promise.all([
      GETRequest("/homePatients/"),
      GETRequest("/companies/"),
      GETRequest("/claims/"),
      GETRequest("/approvals/"),
      GETRequest("/phones/"),
      GETRequest("/appointments/"),
      GETRequest("/invoices/"),
      GETRequest("/stats/")
    ]);

    // Extract data from standard envelopes
    const [p, c, cl, a, ph, ap, inv, st] = results.map(res => (res && res.success) ? res.data : undefined);

    // Update global state
    homePatients = p;
    companies = c;
    claimsData = cl;
    approvalsData = a;
    phones = ph;
    appts = ap;
    invoices = inv;
    stats = st;

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
    broadcast("medcore:claims_updated", claimsData);
    broadcast("medcore:companies_updated", companies);
    broadcast("medcore:approvals_updated", approvalsData);
    broadcast("medcore:appts_updated", appts);
    broadcast("medcore:billing_updated", invoices);

    console.info("✅ Broadcaster: All signals sent.");

  } catch (error) {
    console.error("❌ Broadcaster Error:", error);
  }
  
  // Refresh every 5 minutes
  setTimeout(update, 5 * 60 * 1000); 
}

function broadcast(eventName, data) {
    if (!data) return;
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
}

// Start the broadcast loop
update();
