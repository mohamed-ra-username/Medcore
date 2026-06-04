var homePatients, companies, claimsData, approvalsData, phones, appts, invoices, stats;

let resolveData;
window.dataLoaded = new Promise((resolve) => {
  resolveData = resolve;
});

const api = {
  protocol: "http://",
  subdomain: "",
  domainName: "localhost",
  port: ":5001",
  page: "/api",

  URLlink_with_endpoint: function (endpoint) {
    return this.URLlink + endpoint;
  },

  get URLlink() {
    return `${this.protocol}${this.subdomain}${this.domainName}${this.port}${this.page}`;
  },
};

async function GetDataFromBackend(endpoint) {
  const api_link = api.URLlink_with_endpoint(endpoint);
  // console.info("Fetching: ", api_link);
  try {
    const response = await fetch(api_link);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching data from ${api_link}:`, error);
    return undefined;
  }
}

async function SendDataToBackend(endpoint, method, data) {
  const api_link = api.URLlink_with_endpoint(endpoint);
  console.info(`Sending (${method}): `, api_link);
  try {
    const response = await fetch(api_link, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error sending data to ${api_link}:`, error);
    return undefined;
  }
}

async function update() {
  try {
    console.log("Fetching data from backend...");
    const results = await Promise.all([
      GetDataFromBackend("/homePatients/"),
      GetDataFromBackend("/companies/"),
      GetDataFromBackend("/claims/"),
      GetDataFromBackend("/approvals/"),
      GetDataFromBackend("/phones/"),
      GetDataFromBackend("/appointments/"),
      GetDataFromBackend("/invoices/"),
      GetDataFromBackend("/stats/")
    ]);

    [homePatients, companies, claimsData, approvalsData, phones, appts, invoices, stats] = results;

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
