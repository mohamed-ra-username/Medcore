# 🤝 Engineering Handover Document

This document provides a high-level technical overview of the **Medcore** system for future developers and maintainers.

---

## 🏗️ System Architecture

Medcore is built as a **Tiered Modular Monolith** with a strictly enforced separation of concerns across four backend layers and a high-performance frontend.

### 1. Backend (The Engine)
Organized into specialized top-level directories:
- **`api/`**: The Public REST Layer. Modular routes register with a central blueprint.
- **`private/`**: The Admin Control Layer. A server-side Jinja2 portal for direct JSON data and user management.
- **`core/`**: The Logic Layer.
  - `security/`: Handles encryption, password hashing, and JWT logic.
  - `middleware/`: Gatekeepers for request authentication and PBAC permissions.
  - `integration/`: Branded email warning templates.
- **`persistence/`**: The Data Layer.
  - Uses **Diamond Architecture** (Base Repository -> CRUD Logic -> Aggregator Interface) to prevent circular imports.
  - `data_handler.py` acts as the primary API for all persistence logic.

### 2. Frontend (The Face)
- **Monolith HTML Pattern**: To prevent async race conditions, the UI uses standard full-document HTML (Sidebar/Modals inlined).
- **Synchronized Initialization**: `main-script.js` dispatches a `medcore:ui_ready` signal once the session and language are established.
- **"Radio Station" Sync**: `sync-service.js` awaits the UI signal before broadcasting fetched data to listening UI controllers.
- **Zero-Cache Dev Server**: Mandatory custom server (`dev_server.py`) ensures headers are set for real-time development.

---

## 🚦 Getting Started

### 🛠️ Environment Setup
1.  **Local Launch**: Run **`RUN_APP.bat`** at the root.
2.  **Dev Flow**: Edit JS/CSS and refresh. The dev server prevents stale cache.
3.  **Admin Access**: Visit `/interface/` (Pass: `admin`) to modify raw data.

### 💻 Development Workflow
- **Standardized Envelopes**: All new API routes MUST return `{ success, data, error }`.
- **UI Placeholders**: Use `...` or `-` for initial UI values to avoid `NaN` errors during the first data fetch.
- **PBAC**: Use the granular Permission-Based Access Control map in `core/security/logic.py`.

---

## 📈 Current Project State
The core infrastructure and frontend UI engine are fully modernized. The system implements a unified reactive store, configuration-driven column templates, memory-safe event delegation (WeakSet), and key-value DOM reconciliation (diffing). The caching layer is removed for absolute live-data security, and endpoints are consolidated. Current focus is on SQLite schema migration and interactive database charting/analytics.

---
**Handover Updated by Antigravity CLI Agent**  
*Date: June 30, 2026*
