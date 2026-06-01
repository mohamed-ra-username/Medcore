# 📝 Medcore Project Roadmap

This document outlines the remaining tasks required to transform the Medcore prototype into a production-ready Fullstack Clinic Management System.

---

## 🔐 Phase 1: Authentication & User Management (Current Focus)
The goal is to move from a visual placeholder to a secure, functional user system.

### 🛠️ Backend (Python/Flask)
*   **[ ] Password Security:**
    *   Implement hashing using `werkzeug.security` (scrypt/pbkdf2).
    *   *Never* store plain-text passwords.
*   **[ ] User Data Structure:**
    *   Update `data.json` to store full user objects: `{email, password_hash, role, fname, lname, clinic_name}`.
*   **[ ] Authentication Logic:**
    *   `register_user`: Check if email exists, hash password, save to database.
    *   `login_user`: Verify email exists, compare hashes, generate session token.
*   **[ ] API Endpoints:**
    *   `POST /api/register`: Receive signup data.
    *   `POST /api/login`: Verify credentials.
    *   `GET /api/me`: Verify session token and return current user info.
*   **[ ] Route Protection (Middleware):**
    *   Create a decorator (e.g., `@login_required`) to prevent unauthenticated access to the main data APIs (Patients, Billing, etc.).

### 🖥️ Frontend (JavaScript/HTML)
*   **[ ] Registration Implementation:**
    *   Connect the "Create Account" form to the `/api/register` endpoint.
    *   Add validation (ensure passwords match, email is valid format).
*   **[ ] Login Implementation:**
    *   Connect the "Sign In" form to the `/api/login` endpoint.
    *   Store the authentication status in `localStorage` or a Secure Cookie.
*   **[ ] Session Management:**
    *   On every page load, check if a valid session exists.
    *   Redirect to `login.html` if the user is not logged in.
*   **[ ] Role-Based UI:**
    *   Hide/Show menu items based on user role (e.g., hide "Finance" for Nurses).

---

## 📊 Phase 2: Data Integrity & Performance
Transitioning from a flat JSON file to a robust database.

### 🛠️ Database Migration
*   **[ ] SQLite Setup:**
    *   Integrate `Flask-SQLAlchemy`.
    *   Define SQL Models for all entities (Users, Patients, Claims, etc.).
*   **[ ] Data Migration:**
    *   Create a script to move existing data from `data.json` into the new SQL tables.

### 🛠️ Validation & Error Handling
*   **[ ] Input Sanitization:** Prevent SQL injection and XSS.
*   **[ ] Backend Constraints:** Ensure National IDs are unique and Ages are non-negative.

---

## 🖥️ Phase 3: UI/UX & Feature Expansion
Building the actual medical tools.

### ✨ New Features
*   **[ ] Patient Deep-Dive (`patient.html`):** Create the profile view showing medical history and financial balance.
*   **[ ] Complete CRUD UI:** Write the JavaScript logic for "Add Appointment," "Add Company," and "Add Invoice" modals.
*   **[ ] User Feedback:** Add "Toast" popups for successful saves and helpful error messages for failures.
*   **[ ] Advanced Filtering:** Sort tables by date, status, or amount.

---

## 🛠️ Phase 4: Production Readiness
*   **[ ] HTTPS Setup:** Ensure all data transfers are encrypted.
*   **[ ] CORS Policy:** Lock down the API to only allow requests from the official frontend.
*   **[ ] Automated Backups:** Periodic snapshots of the SQLite database.
*   **[ ] Environment Config:** Use `.env` files for ports and secret keys.
