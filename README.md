# AlertUp

**AlertUp** is a course project for *Ingegneria del Software* and consists of:

- a **frontend** built with **Angular** and packaged as an Android app via **Capacitor**
- a **backend** built with **Node.js + Express** (TypeScript) using **MongoDB** for persistence and **Firebase Admin** for push notifications (FCM)

The application is designed as a community-driven platform for **reporting and visualizing weather / climate-related events** on a map, and for sending **push notifications** to users based on their saved locations.

> **Language note (Italian documentation):** The user-facing UI strings and most of the documentation in this repository (especially under `docs/`) are written in **Italian**. This README is provided in English to make the repository easier to browse internationally, but the authoritative course deliverables remain the Italian PDFs.

---

## Academic disclaimer (course work)

This repository was developed **exclusively for academic purposes** as part of the course **“Ingegneria del Software”**.

- It is **not** intended for production use.
- Security, privacy, resilience, and compliance aspects may be incomplete or simplified.
- Any external services (e.g., Firebase, Google Maps APIs) are used for educational/prototyping purposes.

If you plan to reuse or extend this project, you must perform your own security review and adapt configuration, secrets management, and deployment practices accordingly.

---

## Project members

- **Samuele Zanutto** — Project Manager  
- **Davide Lago** — Frontend  
- **Hamza Rofi** — Backend  

---

## Repository structure

```text
.
├── backend/     # Node.js + Express backend (TypeScript), MongoDB, Firebase Admin (FCM)
├── frontend/    # Angular frontend + Capacitor Android packaging
├── docs/        # Course deliverables (PDF, Italian)
└── README.md
```

---

## Main features (high level)

- Map-based visualization of alerts (frontend uses Google Maps integration)
- User authentication (JWT-based in backend)
- Create / list alerts (stored in MongoDB)
- User saved locations (used to determine relevant notifications)
- Push notifications via Firebase Cloud Messaging (FCM)

---

## Tech stack

### Frontend
- Angular
- Angular Material
- Capacitor (Android packaging)
- Google Maps (JS API / Angular Google Maps)

### Backend
- Node.js
- Express
- TypeScript
- MongoDB + Mongoose
- Firebase Admin SDK (push notifications)
- JWT (token-based auth)

---

## Architecture & Patterns
- **Frontend**: Single Page Application (SPA) with Angular, using Services for state management.
- **Backend**: Modular Express structure with TypeScript interfaces to ensure type safety across the application.
- **Push Engine**: Asynchronous notification flow via Firebase Admin SDK.

## Architecture Highlights
- **RESTful API**: Clean separation between Angular frontend and Node.js backend.
- **Observer Pattern**: Leveraged through Firebase Cloud Messaging for real-time alerts.
- **Middleware Pattern**: Used in Express for JWT authentication and error handling.

---

## Requirements

To run the project locally you typically need:

- **Node.js** (LTS recommended)
- **npm**
- **MongoDB** (local or via Docker)
- **Android tooling** if you want to run the mobile app:
  - Android Studio + Android SDK
  - ADB (Android Debug Bridge)
- A Firebase service account JSON for backend push notifications:
  - `backend/firebase/serviceAccountKey.json` (not recommended to commit publicly)

> Note: the current repository includes `backend/node_modules/` (unusual for Git). Cloning may be heavier than expected.

---

## Quick start (development)

### 1) Start MongoDB (Docker)

```bash
docker run -d --name mongodb -p 27017:27017 mongo
```

### 2) Clone the repository

```bash
git clone https://github.com/ilovecodingtoo/AlertUp
cd AlertUp
```

### 3) Backend setup & run

```bash
cd backend
npm install

# If the project relies on nodemon in scripts, you may need:
npm install --save-dev nodemon

# Build (TypeScript -> JavaScript)
npm run build

# Start
npm run start
```

If `npm run build` / `npm run start` are not configured, the underlying commands shown in the original notes are:

```bash
tsc index.ts
node index
```

> Backend note: the backend integrates Firebase Admin and expects a service account file at `backend/firebase/serviceAccountKey.json`.

### 4) Frontend build & Android (Capacitor)

```bash
cd ../frontend
npm install

# Build Angular app
npm run build

# Sync Capacitor native projects
npx cap sync

# Open Android Studio project
npx cap open android
```

### 5) Android emulator/device networking (backend on localhost)

If you run the backend on your host machine and test from an Android device/emulator, you may need:

```bash
adb reverse tcp:3000 tcp:3000
```

---

## Documentation (Italian course deliverables)

The `docs/` folder contains the official course documents (PDF) in Italian, for example:

The project followed a formal Software Engineering process, documented in the `docs/` folder:
- **D1-D2 (Proposal & Planning)**: Scope definition and resource allocation.
- **D3 (Requirements - SRS)**: Detailed analysis of functional and non-functional requirements.
- **D4 (Testing Plan)**: Strategy for ensuring software reliability.
- **D5 (Design Document)**: Architectural overview, including UML Class and Sequence diagrams.

These documents are part of the academic delivery and should be referenced for detailed requirements, architecture, and testing strategy.
This project wasn't just about coding; it was about rigorous engineering. The full documentation (in Italian) tracks our progress through:
- **Requirements Analysis**: Detailed User Stories and Use Cases.
- **Architectural Design**: UML-based design for system scalability.
- **Verification & Validation**: Systematic testing plan to ensure reliability.

---

## Security and secrets

This project is a **student prototype**. In particular:

- Do **not** commit secrets (API keys, Firebase service accounts, JWT secrets).
- Use environment variables and a secret manager in any real deployment.
- Review CORS policy, authentication flows, and database access rules carefully.

---

## License

This project is licensed under the **MIT License**. 

**What this means:** You are free to use, copy, modify, and distribute this software for academic or commercial purposes, provided that the original copyright notice and this permission notice are included in all copies or substantial portions of the software.

See the [LICENSE](LICENSE) file for the full legal text.
---

## Disclaimer

AlertUp is provided “as is”, without warranty of any kind. The authors and the course staff are not responsible for any misuse, damages, or data loss resulting from the use of this repository.

---

## Contributing

Contributions are welcome in the context of educational improvement (bug fixes, documentation, refactors).  
If you open a PR, please include:

- a clear description of the change
- how to reproduce/test
- screenshots for UI changes (if applicable)

---

## Acknowledgements

- University course: *Ingegneria del Software*
- Open-source ecosystem: Angular, Capacitor, Node.js, Express, MongoDB, Firebase
