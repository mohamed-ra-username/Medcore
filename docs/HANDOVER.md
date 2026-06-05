# 🤝 Engineering Handover Document

This document provides a high-level technical overview of the **Medcore** system for future developers and maintainers.

---

## 🏗️ System Architecture

Medcore is built as a **Tiered Modular Monolith** with a strictly enforced separation of concerns across four backend layers and a component-based frontend.

### 1. Backend (The Engine)
Organized into specialized top-level directories:
- **`api/`**: The Public REST Layer. Modular routes (`auth.py`, `patients.py`, etc.) register with a central blueprint.
- **`private/`**: The Admin Control Layer. A server-side Jinja2 portal for direct JSON data management.
- **`core/`**: The Logic Layer.
  - `security/`: Handles encryption, password hashing, and JWT logic.
  - `middleware/`: Gatekeepers for request authentication and PBAC permissions.
- **`persistence/`**: The Data Layer.
  - Uses **Diamond Architecture** to prevent circular imports.
  - `json_repository.py` is the base file-handler.
  - `data_handler.py` acts as an aggregator interface for the entire backend.

### 2. Frontend (The Face)
- **Component Pattern**: HTML is split into reusable snippets in `views/components/` and injected via `component-loader.js`.
- **Event-Driven State**: Uses a "Radio Station" pattern where the fetcher broadcasts `CustomEvents` for UI listeners.
- **Reactive Store**: Centralized state management via the `Medcore` object in `main-script.js`.
- **Localization**: Robust LTR/RTL engine with locale-aware number formatting.

---

## 🚦 Getting Started for Developers

### 🛠️ Environment Setup
1.  **Python Version**: Requires Python 3.10+.
2.  **Dependencies**: Run `pip install -r requirements.txt`.
3.  **Local Launch**: Run **`RUN_APP.bat`** at the root to start all systems automatically.

### 💻 Development Workflow
- **Security First**: All sensitive routes MUST be protected by `@token_required` and `@permission_required("perm")`.
- **API Standards**: All new endpoints MUST return the standardized `{ success, data, error }` envelope.
- **UI Updates**: Always `await window.dataLoaded` before rendering data to avoid race conditions.

---

## 🛠️ Professional Engineering Tips

- **Conventional Commits**: Use `feat:`, `fix:`, or `refactor:` prefixes for clear project history.
- **PBAC**: Use the granular Permission-Based Access Control map in `core/security/logic.py` instead of hardcoded roles.
- **Naming**: `snake_case` for Python; `kebab-case` for frontend files/HTML.

---

## 📈 Current Project State
The core architecture is finalized. Secure authentication (JWT/PBAC) is implemented, and the CRUD engine is fully operational. Future milestones (SQLite migration, Patient Deep-Dive) are tracked in `docs/TODO.md`.

---
**Handover Completed by Gemini CLI Agent**  
*Date: June 5, 2026*
