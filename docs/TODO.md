# 📝 Medcore: The "Whole System" Roadmap

This document serves as the master blueprint for the Medcore Clinic Management System. It merges performance, security, and clean architecture into a professional development path.

---

## 🏁 Phase 0: Project Foundation (Completed)
*   ✅ **Repository Reorganization:** Concerns separated into `data/`, `docs/`, `backend/`, and `frontend/`.
*   ✅ **Startup Automation:** Master `RUN_APP.bat` created.
*   ✅ **JWT & Permission Engine:** Secure auth and granular PBAC implemented.
*   ✅ **Base CRUD API:** 30+ endpoints handling core clinic operations.
*   ✅ **Locale-Aware Formatting:** Professional number and currency display implemented.

---

## 🏗️ Pillar 1: Clean Architecture (The Refactor)
*Goal: Remove complexity and make the code "airy" and maintainable.*

### 🛠️ Backend: Route Splitting
- [ ] **Auth Module:** Move login/register to `routes/auth_routes.py`.
- [ ] **Patient Module:** Move patient CRUD to `routes/patient_routes.py`.
- [ ] **Finance Module:** Move billing/invoices to `routes/finance_routes.py`.
- [ ] **Clinic Module:** Move stats/appointments to `routes/clinic_routes.py`.

### 🖥️ Frontend: Componentization
- [ ] **HTML Fragments:** Extract Sidebar, Modals, and Tables into `frontend/views/components/`.
- [ ] **Component Loader:** Create `component_loader.js` to dynamically inject HTML snippets.

---

## ⚡ Pillar 2: Performance & Data Integrity
*Goal: Make the app feel fast and "smart" even with thousands of records.*

### 🚀 The "Smart Sync" Engine
- [ ] **Smart DOM Reconciliation:** Refactor tables to only update rows that changed instead of clearing the whole list.
- [ ] **Pagination Logic:** Implement a 20-items-per-page limit with "Next/Prev" controls.

### 🛡️ Backend Resilience & Specific Fixes
- [ ] **Standardized Response Envelopes:** Finalize `{ success, data, error }` pattern across all endpoints.
- [ ] **Self-Healing Storage:** Implement startup health-checks and automated daily JSON backups.
- [ ] **National ID Validation:** Add strict 14-digit check for Egyptian IDs.
- [ ] **Filtered Index Fix:** Ensure deleting/updating works correctly when multiple filters are active (Switch to UUIDs).

---

## 🧠 Pillar 3: The Reactive UI
*Goal: Decouple the "Network" from the "Display" for a crash-proof experience.*

### 📢 Event-Driven State
- [ ] **The "Radio Station" Fetcher:** Refactor `periodic_dataupdate.js` to `dispatchEvent` when data arrives.
- [ ] **Reactive Store:** Move all global variables into a centralized `Medcore` object.
- [ ] **Utility Library:** Move common logic (currency, dates) to `utils.js`.

### 🔔 User Feedback Loops
- [ ] **Toast Notification System:** Professional popups for "Success" and "Error" alerts.
- [ ] **Loading States:** Add button spinners and table skeletons.

---

## 🏥 Pillar 4: Clinic Core Features
*Goal: Build the actual medical tools that clinics need.*

- [ ] **Patient Deep-Dive Page (`patient.html`):** Build the full medical profile view.
- [ ] **Medical History Tracker:** Implement a log of all previous visits and diagnoses.
- [ ] **Financial Reports:** PDF/Excel export for revenue and debt tracking.

---

## 🚀 Pillar 5: Production Readiness
- [ ] **Environment Variables:** Move ports and secret keys to `.env`.
- [ ] **SQLite Migration:** Transition from JSON to relational SQL.
- [ ] **Broad CORS Fix:** Restrict `flask-cors` to only allow the frontend URL.
