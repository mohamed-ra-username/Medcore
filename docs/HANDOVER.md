# 🤝 Engineering Handover Document

This document provides a high-level technical overview of the **Medcore** system for future developers and maintainers.

---

## 🏗️ System Architecture

Medcore is built as a **Tiered Modular Monolith** with a strictly enforced separation of concerns across four backend layers and a high-performance frontend.

### 1. Backend (The Engine)
Organized into specialized top-level directories:
- **`api/`**: The Public REST Layer. Modular routes register with a central blueprint.
- **`private/`**: The Admin Control Layer. A server-side Jinja2 portal for direct database management.
- **`core/`**: The Logic Layer.
  - `security/`: Handles encryption, password hashing, and JWT logic.
  - `middleware/`: Gatekeepers for request authentication and PBAC permissions.
  - `integration/`: Branded email warning templates.
- **`persistence/`**: The Data Layer.
  - **Relational Migration:** Moving from flat files (`data.json`) to a local single-file **SQLite database** (`data/medcore.db`). This supports transaction isolation, secure concurrent writes, and relational SQL queries while remaining 100% offline-ready.
  - Uses **Diamond Architecture** (Base Repository -> CRUD Logic -> Aggregator Interface) to prevent circular imports. `data_handler.py` acts as the primary API for all persistence queries.

### 2. Frontend (The Face)
- **Monolith HTML Pattern**: To prevent async race conditions, the UI uses standard full-document HTML (Sidebar/Modals inlined directly into `home.html`).
- **Alpine.js Template Engine**: All dynamic listing, DOM diffing, and modal lifecycles are written directly in HTML using **Alpine.js** directives (`x-for`, `x-text`, `x-model`). Custom rendering scripts (`rendering.js`, `modal-handling.js`) are deprecated.
- **Reversion Rollback UX**: Editing forms are bound directly to active objects in the array for live-typing previews. Reversions are handled automatically via `Object.assign(item, backup)` if the user Cancels or the API fails.
- **Offline Assets**: All styles (Tailwind CSS) and interactive frameworks (Alpine.js) are hosted locally inside `assets/css/vendor/` and `assets/js/vendor/`. No CDN dependencies are allowed.

---

## 🚦 Getting Started

### 🛠️ Environment Setup
1.  **Local Launch**: Run **`RUN_APP.bat`** at the root.
2.  **Dev Flow**: Edit JS/HTML and refresh. The custom dev server manages CORS and disables browser caching.
3.  **Admin Access**: Visit `/interface/` (Pass: `admin`) to view database tables.

### 💻 Development Workflow
- **Standardized Envelopes**: All new API routes MUST return `{ success, data, error }`.
- **PBAC**: Secure all sensitive endpoints using `@token_required` and `@permission_required("view_name")` decorators.
- **Localization**: Implement translations in-line using Alpine conditions (e.g. `Utils.lang === 'ar' ? ar_name : name`).

---

## 📈 Current Project State
The core Vanilla JS monolithic prototype is fully functional. We are currently executing **Pillar 7 (Modern Monolith Re-Architecture)** to migrate data storage to SQLite and rewrite the template rendering layer to Alpine.js.

---
**Handover Updated by Antigravity CLI Agent**  
*Date: June 30, 2026*
