# Madhav Event — Full Stack

A React (Vite) frontend + Node/Express backend, using **MongoDB** as the database.
Organizers get their own admin panel, attendees get their own dashboard, and
they're redirected to the right one automatically after login.

```
madhav-event-fullstack/
├── backend/     Express API (auth, events, bookings) — data stored in MongoDB
├── frontend/    React + Vite app (the original frontend, now talking to the API)
└── package.json Convenience scripts to install/run both at once
```

## 1. Requirements

- Node.js 18+ and npm
- MongoDB — either:
  - **Local**: install MongoDB Community Server and have it running (default: `mongodb://127.0.0.1:27017`)


## 2. Configure the database connection

Open `backend/.env` and set `MONGODB_URI`:

```env
# Local MongoDB (default)
MONGODB_URI=mongodb://127.0.0.1:27017/madhav_event

## Install

From the project root, install dependencies for both apps in one go:

```bash
npm install
npm run install:all
```

## 4. Run

```bash
npm run dev
```

Or in two separate terminals:

```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

- Backend: **http://localhost:5000** (connects to MongoDB on startup — you'll
  see `✅ Connected to MongoDB` in the terminal)
- Frontend: **http://localhost:5173** (Vite proxies `/api/*` to the backend —
  see `frontend/vite.config.js`)

Open **http://localhost:5173** in your browser.
