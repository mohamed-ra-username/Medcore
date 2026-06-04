var homePatients, companies, claimsData, approvalsData, phones, appts, invoices, stats;

let resolveData;
window.dataLoaded = new Promise((resolve) => {
  resolveData = resolve;
});

async function update() {
  try {
    console.log("Fetching data from backend...");
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

    // Map the results (checking for success)
    [homePatients, companies, claimsData, approvalsData, phones, appts, invoices, stats] = results.map(res => (res && res.success) ? res.data : undefined);

    console.log("Data updated successfully.");

    // Resolve the promise if it hasn't been resolved yet
    resolveData();

    // Trigger UI updates if components are ready
    if (typeof updateAllDashboards === "function") updateAllDashboards();

    // Re-render the active page
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

  } catch (error) {
    console.error("Error fetching data from backend:", error);
  }
  setTimeout(update, 5 * 60 * 1000); // Refresh data every 5 minutes
}

update(); // Initial Data Fetch
