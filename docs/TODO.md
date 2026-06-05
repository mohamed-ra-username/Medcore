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

## 🏗️ Pillar 1: Professional Architecture & Naming (Completed)
*Goal: Rename and reorganize to match industry-standard "Clean Code" patterns.*

### 🛠️ Backend: The "Three-Layer" Refactor
- [x] **Layer 1: The API (`backend/api/`)**
- [x] **Layer 2: The Core (`backend/core/`)**
- [x] **Layer 3: Persistence (`backend/persistence/`)**
    - Diamond Architecture implemented to resolve circular imports.
    - `data_handler.py` and `user_repository.py` integrated into the aggregator.
- [x] **Email Integration Template:**
    - Created `backend/core/integration/email_service.py` with functional placeholders.
    - Designed professional `backend/templates/emails/warning_template.html`.

### 🖥️ Frontend: Standardized Monolith
- [x] **Organized JavaScript (`assets/js/`)**
- [x] **Monolith HTML UI:**
    - Sidebar, Topbar, and Modals merged into main pages to eliminate race conditions.
    - Established `medcore:ui_ready` signal for synchronized data fetching.

---

## ⚡ Pillar 2: Performance & Data Integrity (Current Focus)
*Goal: Make the app feel fast and "smart" even with thousands of records.*

### 🚀 The "Smart Sync" Engine
- [ ] **Smart DOM Reconciliation:** Refactor tables to only update rows that changed (using unique IDs).
- [ ] **Document Fragments:** Build large lists "off-screen" before injecting for maximum speed.
- [ ] **Pagination Logic:** Implement a 20-items-per-page limit with "Next/Prev" controls.

### 🛡️ Backend Resilience & Specific Fixes
- [x] **Standardized Response Envelopes:** 100% of endpoints follow the `{ success, data, error }` pattern.
- [ ] **Self-Healing Storage:** Implement startup health-checks and automated daily JSON backups.
- [x] **Audit `NaN` Bug:** Solved via unified locale and DOM-based translation (`data-value` mapping) and "N/A" fallbacks.

---

## 🧠 Pillar 3: The Reactive UI
*Goal: Decouple the "Network" from the "Display" for a crash-proof experience.*

### 📢 Event-Driven State
- [x] **The "Radio Station" Fetcher:** `sync-service.js` uses `dispatchEvent` to update UI components.
- [ ] **Reactive Store:** Move all global variables into a centralized `Medcore.state` object.

### 🔔 User Feedback Loops
- [x] **Toast Notification System:** Implement success/error alerts.
- [ ] **Loading States:** Polish button spinners and table skeletons (Initial "..." placeholders implemented).

---

## 🏥 Pillar 4: Clinic Core Features
*Goal: Build the actual medical tools that clinics need.*

- [ ] **Patient Deep-Dive Page (`patient.html`):** Build the full medical profile view.
- [ ] **Medical History Tracker:** Implement a log of all previous visits and diagnoses.
- [ ] **Financial Reports:** PDF/Excel export for revenue and debt tracking.

---

## 🧪 Pillar 5: Frontend CRUD Logic & Modals
*Goal: Fix broken user interactions and ensure data flow is reactive.*

- [ ] **Modal Reliability:**
    - [ ] Fix broken Modal opening/closing logic.
    - [ ] Restore missing dynamic option lists (Insurance, Doctors, etc.) in modal forms.
    - [ ] Ensure modals auto-close after a successful API action.
- [ ] **Data Reactivity:**
    - [ ] Fix broken "Delete" and "Edit" frontend actions.
    - [ ] Trigger an immediate `sync-service` update after each successful modal action (Add/Edit/Delete) so the UI refreshes instantly.

---

## 🛠️ Pillar 6: Flask Admin Interface (Completed)
*Goal: Provide a secure, server-side panel to manage raw data.*

- [x] **Core Setup:** Integrated `app.secret_key` and Jinja2 templates.
- [x] **Security:** Master password login for the `/interface/` route.
- [x] **Maintenance Tools:**
    - [x] **Dashboard:** Overview of all data counts (including Users).
    - [x] **Category Viewers:** Table views for all JSON entities.
    - [x] **Data Actions:** Delete individual rows directly.
    - [x] **Raw Editor:** Manually edit and overwrite `data.json` and `users.json`.
