const API_BASE_URL = "http://localhost:5001/api";

async function baseRequest(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem("token");
    const headers = { 'Content-Type': 'application/json' };
    if (token)
      headers['Authorization'] = `Bearer ${token}`;

    const config = { method, headers };
    if (data && (method === 'POST' || method === 'PUT')) config.body = JSON.stringify(data);

    try {
        const response = await fetch(url, config);
        if (response.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`API Error:`, error);
        return { success: false, error: "Network Error" };
    }
}

async function GETRequest(endpoint) { return await baseRequest(endpoint, 'GET'); }
async function POSTRequest(endpoint, data) { return await baseRequest(endpoint, 'POST', data); }
async function PUTRequest(endpoint, data) { return await baseRequest(endpoint, 'PUT', data); }
async function DELETERequest(endpoint) { return await baseRequest(endpoint, 'DELETE'); }
