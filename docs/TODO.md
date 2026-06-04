       1 - # 📝 Medcore Project Roadmap
       2 -
       3 - This document outlines the tasks required to transform the Medcore
         prototype into a production-ready Fullstack Clinic Management System.
       4 -
       5 - ---
       6 -
       7 - ## 🏁 Phase 0: Project Foundation (Completed)
       8 - *   ✅ **Repository Reorganization:** Concerns separated into
         `data/`, `docs/`, and standard directories.
       9 - *   ✅ **Startup Automation:** Created `RUN_APP.bat` master runner.
      10 - *   ✅ **Data Sync Architecture:** Implemented "Data Promise"
         pattern.
      11 - *   ✅ **Full CRUD API:** 30+ endpoints handling data mutation.
      12 - *   ✅ **JSON Persistence:** Reliable state saving into
         `data.json`.
      13 - *   ✅ **Modal Integration:** UI modals linked to backend API.
      14 -
      15 - ---
      16 -
      17 - ## 🔐 Phase 1: Security & Identity (Completed)
      18 - *   ✅ **Isolated User Storage:** Credentials kept in
         `data/users.json`.
      19 - *   ✅ **Password Security:** Hashing implemented using
         `werkzeug.security`.
      20 - *   ✅ **JWT Core:** Tokens generated with 24h expiration.
      21 - *   ✅ **PBAC (Permissions):** Master Permissions Map and
         `@permission_required` implemented.
      22 - *   ✅ **Auth UI:** Real login/signup connected to API.
      23 -
      24 - ---
      25 -
      26 - ## 🏗️ Phase 2: Modular Monolith Refactor (Current Focus)
      27 - "Un-cramping" the codebase by splitting giant files into
         specialized modules.
      28 -
      29 - ### 🛠️ Backend Modularization
      30 - *   **[ ] Split API Routes:** Divide `api.py` into `auth.py`,
         `patients.py`, `finance.py`, and `clinic.py`.
      31 - *   **[ ] Security Isolation:** Move JWT and Permission logic to
         `backend/core/security.py`.
      32 - *   **[ ] Self-Healing Handler:** Implement auto-backups and
         corrupt-file recovery in `data_handler.py`.
      33 -
      34 - ### 🖥️ Frontend Architecture
      35 - *   **[ ] HTML Componentization:** Split `home.html` into reusable
         snippets (Sidebar, Modals, Tables) in `views/components/`.
      36 - *   **[ ] Controller-Based JS:** Move page-specific logic from
         `main_script.js` to individual controllers (e.g.,
         `home_controller.js`, `billing_controller.js`).
      37 - *   **[ ] Reactive Store:** Refactor `Medcore` store to use an
         Event-Driven pattern (dispatching events when data changes).
      38 - *   **[ ] Shared Utility Library:** Move `numberFormatter` and
         `initials` to `assets/js/utils.js`.
      39 -
      40 - ---
      41 -
      42 - ## 📊 Phase 3: Data Integrity & UX
      43 - *   **[ ] Standardized API Envelopes:** Finalize 100% consistent `{
         success, data, error }` across all sub-routes.
      44 - *   **[ ] UI Feedback Loops (Toasts):** Global notification system
         for success/error alerts.
      45 - *   **[ ] Strict Validation:** Backend constraints for all input
         fields.
      46 - *   **[ ] Patient Deep-Dive Page:** Build the medical history
         "Individual Profile" view.
      47 -
      48 - ---
      49 -
      50 - ## 🚀 Phase 4: Production & Future
      51 - *   **[ ] SQLite Migration:** Transition from JSON to SQL.
      52 - *   **[ ] WhatsApp Integration:** Automated reminders.
      53 - *   **[ ] Production Config:** Remove hardcoded ports, use `.env`
         for secrets.
