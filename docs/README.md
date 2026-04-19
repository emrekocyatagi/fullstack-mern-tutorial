# 📚 ThinkBoard — MERN Stack Learning Documentation

> A complete, mentor-style guide to understanding every concept in this project.  
> Written to help you build future MERN apps **from scratch**, not just follow tutorials.

---

## How to Use This Documentation

Read the parts in order — each builds on the previous one. After each part, answer the comprehension questions *without looking at the answers*. If you can't, re-read that section.

| Part | Topic | File |
|---|---|---|
| **01** | 🌐 HTTP & the Express Backend | [01_HTTP_and_Backend.md](../docs/01_HTTP_and_Backend.md) |
| **02** | 🗄️ MongoDB & Mongoose | [02_MongoDB_and_Mongoose.md](../docs/02_MongoDB_and_Mongoose.md) |
| **03** | ⚛️ React Frontend | [03_React_Frontend.md](../docs/03_React_Frontend.md) |
| **04** | 🔀 React Router | [04_React_Router.md](../docs/04_React_Router.md) |
| **05** | 🏗️ Full Architecture, Data Flow & Bugs | [05_Architecture_and_Bugs.md](../docs/05_Architecture_and_Bugs.md) |

---

## The Project in One Sentence

**ThinkBoard** is a notes app: a React frontend (Vite + Tailwind + DaisyUI) that communicates via HTTP (Axios) with an Express API (Node.js), which stores notes in MongoDB (via Mongoose) and protects itself with a Redis-backed rate limiter (Upstash).

---

## Key Files Quick Reference

```
fullstack-mern-tutorial/
├── backend/
│   └── src/
│       ├── server.js                  ← Entry point, middleware, server start
│       ├── config/
│       │   ├── db.js                  ← MongoDB connection
│       │   └── upstash.js             ← Redis rate limiter config
│       ├── models/
│       │   └── Note.js                ← Mongoose schema + model
│       ├── routes/
│       │   └── notesRoutes.js         ← URL-to-controller mapping
│       ├── controllers/
│       │   └── notesController.js     ← Business logic (CRUD)
│       └── middleware/
│           └── rateLimiter.js         ← Rate limiting middleware
└── frontend/
    └── src/
        ├── main.jsx                   ← React entry point, BrowserRouter
        ├── App.jsx                    ← Route definitions
        ├── pages/
        │   ├── HomePage.jsx           ← List all notes
        │   ├── CreatePage.jsx         ← Create note form
        │   └── NoteDetailPage.jsx     ← View/edit one note (stub)
        ├── components/
        │   ├── Navbar.jsx             ← App header + navigation
        │   ├── NoteCard.jsx           ← Single note display card
        │   └── RateLimitedUI.jsx      ← Rate limit error message
        └── lib/
            ├── axios.js               ← Pre-configured Axios instance
            └── utils.js               ← formatDate helper
```

---

## 3 Bugs to Fix Right Now

| # | File | Bug | Fix |
|---|---|---|---|
| 1 | `NoteCard.jsx` line 8 | Links to `/note/:id` but route is `/notes/:id` | Change to `` `/notes/${note._id}` `` |
| 2 | `NoteCard.jsx` line 23 | `handleDelete` is called but not defined | Pass as prop from `HomePage` |
| 3 | `CreatePage.jsx` lines 50+53 | Duplicate `onChange` on title input | Remove one |

---

## The MERN Learning Roadmap

```
Where you are now                    What to build next
──────────────────                   ──────────────────
✅ CRUD API with Express             → Add auth (JWT)
✅ MongoDB + Mongoose models         → Relational models (User owns Notes)
✅ React state + useEffect           → Custom hooks, React Query
✅ React Router basics               → Nested routes, protected routes
✅ Rate limiting                     → Per-user limits, auth middleware
⬜ NoteDetailPage (stub)            → Implement with useParams + PUT
⬜ Authentication                    → bcrypt, JWT, httpOnly cookies
⬜ Deployment                        → Render (backend) + Vercel (frontend)
⬜ Testing                           → Vitest + Supertest
```
