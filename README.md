# 🗒️ ThinkBoard

A full-stack notes application built with the MERN stack. Create, view, edit, and delete notes — with a clean UI and a Redis-backed rate limiter.

**🔗 Live Demo → https://fullstack-mern-tutorial.onrender.com/**

## ✨ Features

- 📝 **Create** notes with a title and content
- 👁️ **View & Edit** any note on its own detail page
- 🗑️ **Delete** notes (with confirmation) from the card or the detail view
- 📭 **Empty state** — friendly prompt when no notes exist yet
- ⚡ **Rate limiting** — 100 requests per 60 seconds via Upstash Redis (sliding window)
- 🌍 **Deployed** — single Express server serves the React build in production

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, DaisyUI, React Router v7 |
| **HTTP client** | Axios |
| **Backend** | Node.js, Express |
| **Database** | MongoDB Atlas + Mongoose |
| **Rate limiting** | Upstash Redis (`@upstash/ratelimit`) |
| **Notifications** | react-hot-toast |
| **Icons** | lucide-react |
| **Deployment** | Render |

---

## 📁 Project Structure

```
fullstack-mern-tutorial/
├── package.json               ← Root scripts: build + start for deployment
├── backend/
│   └── src/
│       ├── server.js          ← Express app, middleware, static serving (prod)
│       ├── config/
│       │   ├── db.js          ← MongoDB connection
│       │   └── upstash.js     ← Upstash Redis rate limiter (100 req / 60 s)
│       ├── models/
│       │   └── Note.js        ← Mongoose schema + model (title, content, timestamps)
│       ├── routes/
│       │   └── notesRoutes.js ← GET / POST / PUT / DELETE /api/notes
│       ├── controllers/
│       │   └── notesController.js ← CRUD logic
│       └── middleware/
│           └── rateLimiter.js ← Rate limiting middleware
└── frontend/
    └── src/
        ├── main.jsx           ← App entry point, BrowserRouter, Toaster
        ├── App.jsx            ← Route definitions
        ├── pages/
        │   ├── HomePage.jsx       ← List all notes, delete from card
        │   ├── CreatePage.jsx     ← New note form
        │   └── NoteDetailPage.jsx ← View + edit + delete a single note
        ├── components/
        │   ├── Navbar.jsx         ← App header + "New Note" button
        │   ├── NoteCard.jsx       ← Note card with delete action
        │   ├── NotesNotFound.jsx  ← Empty state with CTA
        │   └── RateLimitedUI.jsx  ← Shown on 429 responses
        └── lib/
            ├── axios.js           ← Axios instance (dev: localhost:5001, prod: /api)
            └── utils.js           ← formatDate helper
```

---

## 🚀 Running Locally

### Prerequisites

- Node.js 18+
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- An [Upstash Redis](https://upstash.com/) database

### 1. Clone the repo

```bash
git clone https://github.com/emrekocyatagi/fullstack-mern-tutorial.git
cd fullstack-mern-tutorial
```

### 2. Set up environment variables

Create `backend/.env`:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### 3. Install dependencies & run

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend** (in a second terminal):
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🌐 Deployment (Render)

The root `package.json` provides the scripts Render uses:

```json
"build": "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend",
"start": "npm run start --prefix backend"
```

In production, Express serves the compiled React app as static files and handles all routes (no separate frontend hosting needed).

Set the following environment variables in your Render dashboard:
- `MONGO_URI`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `NODE_ENV=production`

---

## 📚 Learning Documentation

This project comes with detailed learning notes explaining every concept used:

| Part | Topic |
|---|---|
| [01 — HTTP & Backend](./docs/01_HTTP_and_Backend.md) | HTTP methods, req/res, status codes, middleware |
| [02 — MongoDB & Mongoose](./docs/02_MongoDB_and_Mongoose.md) | Schemas, models, CRUD queries, async/await |
| [03 — React Frontend](./docs/03_React_Frontend.md) | Components, useState, useEffect, controlled inputs |
| [04 — React Router](./docs/04_React_Router.md) | SPAs, routes, Link vs a, useNavigate, useParams |
| [05 — Architecture & Data Flow](./docs/05_Architecture_and_Bugs.md) | Full request trace, MVC, env vars, bug fixes |

---

## 🗺️ What's Next

```
✅ Full CRUD (Create, Read, Update, Delete)
✅ Rate limiting with Upstash Redis
✅ Empty state + toast notifications
✅ Production build + deployment on Render
⬜ User authentication (JWT + bcrypt)
⬜ Per-user rate limiting (by IP or user ID)
⬜ Search / filter notes
⬜ Unit & integration tests (Vitest + Supertest)
```

