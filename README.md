<p align="center">
    <img src="frontend/img/logo.png" alt="logo" width="200"/>
</p>

# Medcore: Fully Automated System For Clinics

![Last commit](https://img.shields.io/github/last-commit/mohamed-ra-username/Medcore?logo=github)

![GitHub language count](https://img.shields.io/github/languages/count/mohamed-ra-username/Medcore)
![GitHub top language](https://img.shields.io/github/languages/top/mohamed-ra-username/Medcore?color=yellow)

_مشروع تخرج [فريق الاحلام](#team) <sub><small>(حلمهم يتخرجوا)</small>_</sub>

A final-year graduation project focused on **reducing unnecessary manual work in clinics**. This project was developed as part of the requirements for the degree of `Computer Science` at **Akhbar-El-Youm**[^College].
[^College]:[_اخبار اليوم_](https://www.facebook.com/AkhbarelyomAcademy/) هى اكادمية فى 6 اكتوبر

---

## 📸 Project Showcase

![Project Preview](showcase.gif "showcase gif")

---

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Tech Stack](#tech-stack)
4. [Architecture & Design](#architecture--design)
5. [Modular Structure](#modular-structure)
6. [Milestones](#milestones)
7. [Getting Started](#getting-started)
8. [Documentation & Reports](#documentation--reports)
9. [Team](#team)

---

## ⚡ Project Overview

The **Medcore** aims to solve the problem of excessive manual labor and time consumption by implementing a fully automated system that calculates costs and handles patient management for clinics.

**Problem Statement:** Clinics often struggle with manual data entry, leading to errors and slow processing times for patients and insurance claims.

**Proposed Solution:** A centralized web-based management system with a robust API that automates data persistence, real-time analytics, and insurance claim tracking.

---

## ✨ Key Features

**Real-time Analytics Dashboard:** Visual overview of patient counts, appointments, pending claims, and revenue.

**Full CRUD Management:** Create, Read, Update, and Delete capabilities for patients, insurance companies, invoices, and appointments.

**Insurance Claims Tracking:** Specialized module for submitting and reviewing insurance claims and authorizations.

**Multi-language Support:** Full support for English and Arabic (RTL) with dynamic translation switching.

**Automated Data Sync:** Background data synchronization using a Promise-based architecture to ensure a race-condition-free UI.

---

## 🛠 Tech Stack

**Frontend:** HTML5, CSS3, JavaScript (Vanilla ES6+)

**Backend:** Python 3.10+ (Flask Framework)

**Database:** JSON-based persistence (Scalable to SQLite/SQLAlchemy)

**Networking:** RESTful API with CORS support

---

## 🏗 Architecture & Design

The system follows a modular Monolithic architecture with a clear separation between the UI and the Data Access Layer.

**Frontend Logic:** Driven by a centralized "Data Promise" pattern in `update_data.js` to handle asynchronous state management.

**Backend Logic:** Modularized into specific handlers to ensure a clean and maintainable API.

---

## 📂 Modular Structure

The backend has been refactored into a highly modular system for better maintainability:

**get_functions.py:** Handles all data retrieval operations (GET requests).

**post_functions.py:** Handles data creation logic (POST requests).

**put_functions.py:** Handles data update and modification logic (PUT requests).

**delete_functions.py:** Handles data removal operations (DELETE requests).

**data_handler.py:** Manages the core data loading and saving to `data.json`.

---

## 📑 Milestones

### 🏁 1. Core Development (Finished)
- [x] Responsive HTML/CSS Layout  
- [x] Dynamic JavaScript Rendering  
- [x] Arabic (RTL) Support & Localization  
- [x] Asynchronous Data Sync (Promise Pattern)  
- [x] Flask API Infrastructure  
- [x] JSON Data Persistence Layer  
- [x] Full CRUD API Endpoints (30+ routes)  
- [x] Modular Backend Function Handlers  
- [x] Real-time Search & Filtering (Patients/Claims)  

### 🔒 2. Security & Identity (Upcoming)
- [ ] Secure User Registration & Signup  
- [ ] Password Hashing (Werkzeug Security)  
- [ ] JWT or Session-based Authentication  
- [ ] Role-Based Access Control (RBAC)  

### 📊 3. Data & Performance (Upcoming)
- [ ] Migration to SQLite Relational Database  
- [ ] SQLAlchemy ORM Integration  
- [ ] Comprehensive Form Validation  
- [ ] Database Backup & Restore System  

### ✨ 4. Advanced Features (Upcoming)
- [ ] Patient Deep-Dive Profile Page  
- [ ] Financial Report Export (PDF/Excel)  
- [ ] Appointment Reminders (WhatsApp/Email)  
- [ ] Production-Ready Server Deployment  

---

## 🚀 Roadmap

For a detailed list of planned improvements, bug fixes, and upcoming features, please refer to the [TODO.md](TODO.md) file.

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

**Backend:** Run [start_backend.bat](start_backend.bat) (Starts Flask on port 5001)

**Frontend:** Run [start_frontend.bat](start_frontend.bat) (Starts HTTP server on port 5000)

**View:** Open [view.bat](view.bat) or navigate to `http://localhost:5000/frontend/pages/home.html`

**Initial Setup:** If dependencies are missing, run [init.bat](init.bat)

---

## 📄 Documentation & Reports

[📖 Final Project Report (PDF)](docs/Final_Report.pdf "report")

[📊 Project Presentation Slides](docs/Presentation.pptx "presentation")

[💡 Requirement Specification](docs/SRS.pdf "requirements")

---

## 👥 Team

**Omar Hamdallah** - Team Leader/Frontend Dev

**Mohamed Ragab Mubarak** - Backend Dev

**Adham Galal** - Frontend Dev

**Supervisor:** د.انجى

---
