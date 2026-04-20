# 📚 ThinkBoard — Learning Documentation Index

> Detailed mentor-style notes explaining every concept used in this project.  
> Read these alongside the code to understand the *why*, not just the *what*.

---

## Reading Order

| Part | Topic | What you'll learn |
|---|---|---|
| [01 — HTTP & Backend](./01_HTTP_and_Backend.md) | 🌐 HTTP & Express | Methods, req/res, status codes, middleware, CORS |
| [02 — MongoDB & Mongoose](./02_MongoDB_and_Mongoose.md) | 🗄️ Database | Schemas, models, CRUD queries, async/await, Upstash Redis |
| [03 — React Frontend](./03_React_Frontend.md) | ⚛️ React | All components, useState, useEffect, controlled inputs, props |
| [04 — React Router](./04_React_Router.md) | 🔀 Routing | SPAs, routes, Link vs a, useNavigate, useParams |
| [05 — Architecture & Data Flow](./05_Architecture_and_Bugs.md) | 🏗️ Full Picture | Request traces, MVC, env vars, all 3 bugs found & fixed |

Each part includes:
- ✅ Real-world analogies
- 💻 Code examples taken directly from this project
- ❓ 3–5 comprehension questions to test your understanding
- 🚀 What to learn next

---

## Completed Features (as of final commit)

| Feature | Status |
|---|---|
| Create notes | ✅ |
| List all notes | ✅ |
| View & edit a note (`NoteDetailPage`) | ✅ |
| Delete from card & detail page | ✅ |
| Empty state (`NotesNotFound`) | ✅ |
| Rate limiting — 100 req / 60 s | ✅ |
| Production build + Render deployment | ✅ |
| Smart Axios baseURL (dev vs prod) | ✅ |

---

## Key Files Quick Reference

```
fullstack-mern-tutorial/
├── package.json               ← Root build + start scripts (for Render)
├── backend/
│   └── src/
│       ├── server.js          ← Express app, middleware, prod static serving
│       ├── config/
│       │   ├── db.js          ← MongoDB connection (exits on failure)
│       │   └── upstash.js     ← Redis rate limiter — 100 req / 60 s
│       ├── models/
│       │   └── Note.js        ← Schema: title, content, timestamps
│       ├── routes/
│       │   └── notesRoutes.js ← 5 routes: GET / GET:id / POST / PUT / DELETE
│       ├── controllers/
│       │   └── notesController.js ← All CRUD logic with try/catch
│       └── middleware/
│           └── rateLimiter.js ← Checks Upstash, returns 429 if over limit
└── frontend/
    └── src/
        ├── main.jsx           ← Entry: BrowserRouter + Toaster
        ├── App.jsx            ← 3 routes defined here
        ├── pages/
        │   ├── HomePage.jsx       ← Fetch all notes, show grid or empty state
        │   ├── CreatePage.jsx     ← Controlled form → POST → navigate("/")
        │   └── NoteDetailPage.jsx ← useParams → GET → edit form → PUT
        ├── components/
        │   ├── Navbar.jsx         ← Brand + "New Note" Link
        │   ├── NoteCard.jsx       ← Card + delete (setNotes prop)
        │   ├── NotesNotFound.jsx  ← Empty state with CTA link
        │   └── RateLimitedUI.jsx  ← Shown when isRateLimited = true
        └── lib/
            ├── axios.js           ← baseURL: dev=localhost:5001/api, prod=/api
            └── utils.js           ← formatDate(date) → "Apr 19, 2026"
```
