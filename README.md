# 🧠 AI App Architect Pro (Track A Submission)

A powerful, universal "Low-Code" engine that converts structured JSON configurations into production-ready, full-stack applications with real SQL database infrastructure.

## 🚀 Key Features (Meeting Track A Requirements)

### 1. Dynamic Infrastructure Generation
Unlike static generators, this platform executes **real SQL DDL commands** (`CREATE TABLE`) dynamically on a PostgreSQL database based on the incoming JSON schema.

### 2. Universal App Runtime
- **Component Registry Pattern:** Easily extensible UI components (Tables, Forms, Dashboards, Charts, CSV Importers).
- **Schema-first Rendering:** The UI automatically maps to database fields even if the UI config is incomplete.
- **Resilient Engine:** Handles inconsistent JSON, missing fields, and unknown components without breaking.

### 3. Integrated AI Intelligence
- **AI Prompt-to-App:** Natural language interface that generates complex JSON blueprints.
- **AI Mock Data Filler:** Intelligently populates generated tables with domain-specific mock data (Price, Email, Roles, etc.) using fuzzy-matching logic.

### 4. Mandatory Features Implemented
- **Multi-language Support:** Instant switching between English and Hindi.
- **CSV Import System:** Upload → Map → Store → Render workflow fully integrated.
- **Advanced Authentication:** User-scoped data access with config-driven UI.
- **Event-based Notifications:** Real-time system activity feed for infrastructure tracking.

## 🛠 Tech Stack
- **Frontend:** React 18, Tailwind CSS v4, Glassmorphism UI System.
- **Backend:** Node.js (TypeScript), Express.
- **Database:** PostgreSQL (Dynamic Relational Schema).
- **Security:** Stateless JWT Authentication.

## 🧩 Architecture Decisions
- **Systems Thinking:** Built as a "Meta-Platform". The core doesn't know about "E-commerce" or "To-dos"—it only knows about "Entities" and "Views".
- **Resilience:** If a user defines a form without fields, the system introspects the database to auto-generate them.
- **Extensibility:** New widgets can be added to the `ComponentRegistry` in minutes without touching the core rendering logic.

## 📦 How to Run
1. **Backend:** `cd backend && npm install && npm run dev`
2. **Frontend:** `cd frontend && npm install && npm run dev`
3. **Database:** Ensure `DATABASE_URL` is set in `.env`.

---
*Created for the Advanced Agentic Coding Assignment.*
