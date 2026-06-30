<p align="center">
    <img src="frontend/assets/img/logo.png" alt="logo" width="200"/>
</p>

# Medcore: Fully Automated System For Clinics

![Last commit](https://img.shields.io/github/last-commit/mohamed-ra-username/Medcore?logo=github)
![GitHub language count](https://img.shields.io/github/languages/count/mohamed-ra-username/Medcore)
![GitHub top language](https://img.shields.io/github/languages/top/mohamed-ra-username/Medcore?color=yellow)

_مشروع تخرج [فريق الاحلام](#team) <sub><small>(حلمهم يتخرجوا)</small>_</sub>

A professional clinic management system focused on **eliminating manual overhead**. Built with a tiered Python/Flask backend and a responsive Vanilla JS frontend.

---

## 🚀 Quick Start

1.  **Open**: **`RUN_APP.bat`** at the project root.
2.  The script will handle dependencies and launch the **Backend (5001)** and the **Dev Server (5000)**.
3.  Access the admin panel directly at `http://localhost:5001/interface/`.

---

## ⚡ Project Overview

The **Medcore** system automates core clinical workflows:
- **Patient Management:** Secure storage and retrieval of medical records.
- **Financial Tracking:** Real-time billing, invoices, and insurance claim processing.
- **Analytics:** Dynamic dashboards showing clinic health and revenue.

---

## 📂 Project Structure

- **`backend/`**: Modular logic following a 4-layer architecture (`api`, `private`, `core`, `persistence`).
- **`frontend/`**: High-performance Vanilla JS interface using a Monolith HTML pattern.
- **`data/`**: Central storage for JSON databases (`data.json`, `users.json`).
- **`commands/`**: Specialized dev scripts and server handlers.

---

## ✨ Key Features

**🔒 Tiered Security:** Granular Permission-Based Access Control (PBAC) using JWT tokens.

**⚡ Reactive State Engine:** Global state proxy automatically triggers UI redrawing and metrics recalculations without layout delays.

**🧩 Headless Column Configurations:** Reusable column schemas decouple database properties from HTML layouts.

**🚀 Surgical DOM Reconciliation:** Key-value diffing and Document Fragment buffers only paint active cell changes.

**🌍 Full Localization:** LTR/RTL support for English and Arabic with locale-aware number formatting.

**🛠️ Integrated Admin Portal:** Direct server-side tool for managing raw JSON data and user accounts.

---

## 📑 Completed Milestones

- ✅ **4-Layer Backend Refactor:** Strict separation of API, Admin, Logic, and Data.
- ✅ **Diamond Persistence Architecture:** Resolved all circular import and stability issues.
- ✅ **Standardized API Envelope:** 100% of endpoints return consistent JSON wrappers.
- ✅ **Monolith HTML UI:** Eliminated async race conditions for sidebar/modal loading.
- ✅ **Unified Reactive Store:** Integrated state observers and automatic DOM diffing.
- ✅ **Headless Reconciler Engine:** Dynamic property path resolvers, XSS sanitization, and WeakSet click delegation.
- ✅ **PBAC Engine:** Advanced permission maps for Doctors, Nurses, and Staff.
- ✅ **Custom Dev Server:** Built-in CORS and Anti-Cache support.

---

## 📖 Technical Documentation

- [HANDOVER.md](docs/HANDOVER.md): Comprehensive Architectural Deep-Dive.
- [TODO.md](docs/TODO.md): Master Roadmap & Current Sprints.
- [changes.txt](docs/changes.txt): Chronological history of technical updates.

---

## 👥 Team

**Omar Hamdallah** - Team Leader/Frontend Dev
**Mohamed Ragab Mubarak** - Fullstack Dev
**Adham Galal** - Frontend Dev

**Supervisor:** د.انجى

---
