# 🤝 Engineering Handover Document

This document provides a high-level technical overview of the **Medcore** system for future developers and maintainers.

---

## 🏗️ System Architecture

Medcore is built as a **Modular Monolith** with a clear separation between the presentation layer (Frontend) and the data access layer (Backend).

### 1. Frontend (Presentation)
- **Vanilla Stack:** Built with standard HTML5, CSS3, and ES6 JavaScript.
- **Asynchronous State:** Uses a centralized `window.dataLoaded` Promise (found in `update_data.js`). This ensures that no UI rendering occurs before the core data variables are populated.
- **Translation Engine:** A custom-built localization system (`translations.js`) that supports dynamic LTR (English) and RTL (Arabic) switching without page reloads.

### 2. Backend (Logic & API)
- **Flask Framework:** A Python-based RESTful API.
- **Modular Handlers:** The business logic is separated into specific functional modules:
  - `get_functions.py`: Data retrieval and statistics calculation.
  - `post_functions.py`: Logic for creating new records.
  - `put_functions.py`: Logic for updating existing records.
  - `delete_functions.py`: Logic for removing records.
- **Persistence:** Currently uses `data.json` for storage, managed by `data_handler.py`.

---

## 🚦 Getting Started for Developers

### 🛠️ Environment Setup
1.  **Python Version:** Requires Python 3.10+ (due to modern type-hinting).
2.  **Dependencies:** Run `pip install -r requirements.txt`.
3.  **Local URLs:**
    - Frontend: `http://localhost:5000`
    - Backend API: `http://localhost:5001/api`

### 💻 Development Workflow
- **Adding a Route:** Define the route in `backend/routes/api.py`, then implement the logic in the corresponding `handler/*.py` file.
- **UI Updates:** Modify `script.js`. Ensure any new rendering function starts with `await window.dataLoaded;` to prevent race conditions.

---

## 🛠️ Professional Engineering Tips for this Repo

To keep this repository high-quality, we recommend following these industry standards:

### 1. Version Control (Git)
- **Conventional Commits:** Use prefixes like `feat:`, `fix:`, `docs:`, or `refactor:`. 
  - *Example:* `feat: add patient history endpoint`
- **Branch Protection:** Avoid pushing directly to `main`. Use Pull Requests (PRs) for code reviews.

### 2. Code Quality
- **Linter/Formatter:** Use `flake8` for Python and `ESLint` for JavaScript.
- **EditorConfig:** Use the included `.editorconfig` to ensure everyone on your team has the same indentation and line-ending settings.

### 3. Security (Critical)
- **Environment Variables:** Never commit secrets (API keys, DB passwords). Use a `.env` file (see `.env.example`).
- **Input Sanitization:** Always validate and sanitize data on the **Backend** before saving it.

---

## 📈 Current Project State
The core CRUD (Create, Read, Update, Delete) engine is fully implemented. The next major phase is **Authentication** and **Database Migration (SQLite)**. Detailed tasks are listed in the [TODO.md](TODO.md) file.

---
**Handover Completed by Gemini CLI Agent**  
*Date: June 1, 2026*
