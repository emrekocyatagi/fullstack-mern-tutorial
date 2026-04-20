# 🌐 Part 1: HTTP & the Express Backend

> **Mentor note:** Think of HTTP as the language that browsers and servers use to talk to each other. Every time your React app needs data, it "speaks HTTP" to your Express server. Understanding this conversation is the single most important skill in full-stack development.

---

## 1.1 What is HTTP?

**HTTP (HyperText Transfer Protocol)** is a set of rules that defines how messages are sent between a **client** (the browser / React app) and a **server** (your Express app).

### ✅ Real-world analogy

Think of a restaurant:
- You (the client) hand a **request** to the waiter.
- The kitchen (the server) processes it and sends back a **response** — the food.
- The waiter is HTTP — a standardised way of passing messages back and forth.

Every HTTP exchange has two parts:

| Part | What it contains |
|---|---|
| **Request** | Method, URL, Headers, (optional) Body |
| **Response** | Status code, Headers, Body (usually JSON) |

---

## 1.2 HTTP Methods in This Project

HTTP **methods** (also called "verbs") tell the server *what you want to do* with a resource.

### The Four Methods Used Here

| Method | What it means | Route in this project |
|---|---|---|
| `GET` | Read / fetch data | `GET /api/notes` — fetch all notes |
| `GET` | Read one item | `GET /api/notes/:id` — fetch one note |
| `POST` | Create something new | `POST /api/notes` — create a note |
| `PUT` | Update existing data | `PUT /api/notes/:id` — edit a note |
| `DELETE` | Remove data | `DELETE /api/notes/:id` — delete a note |

### 💻 From your code (`notesRoutes.js`)

```js
router.get("/", getAllNotes);        // GET  /api/notes
router.get("/:id", getNotesById);   // GET  /api/notes/:id
router.post("/", createNotes);      // POST /api/notes
router.put("/:id", updateNote);     // PUT  /api/notes/:id
router.delete("/:id", deleteNote);  // DELETE /api/notes/:id
```

**Why not use GET for everything?** — GET requests have no body, are cached by browsers, and appear in browser history. You'd never want to send sensitive data or mutation commands via GET. The verb communicates *intent*, which helps browsers, proxies, and developers understand what's happening.

---

## 1.3 Request & Response Objects

When Express receives an HTTP request, it passes two special objects to your route handler: `req` (request) and `res` (response).

### The `req` object — what the client sent

```js
// notesController.js — createNotes function
const { title, content } = req.body;  // JSON body sent by React (POST)

// notesController.js — getNotesById
const note = await Note.findById(req.params.id);  // :id from the URL
```

| `req` property | What it holds | Example |
|---|---|---|
| `req.body` | JSON data sent in the request body | `{ title: "My Note", content: "..." }` |
| `req.params` | URL path variables (`:id`) | `req.params.id → "664abc..."` |
| `req.method` | The HTTP verb used | `"GET"`, `"POST"` |
| `req.url` | The path requested | `"/api/notes"` |

### The `res` object — what your server sends back

```js
// Sending success with data
res.status(200).json(notes);

// Sending "created" with the new document
res.status(201).json({ message: "Note created successfully", note: newNote });

// Sending an error
res.status(404).json({ message: "Note not found" });
```

`res.status(...)` sets the HTTP status code. `.json(...)` serialises a JavaScript object into JSON and sends it as the response body. They are **chainable** because `res.status()` returns the same `res` object.

---

## 1.4 HTTP Status Codes Used in This Project

Status codes are 3-digit numbers that instantly communicate whether a request succeeded or failed.

| Code | Name | When your project uses it |
|---|---|---|
| `200` | OK | Successfully fetched all notes / updated / deleted |
| `201` | Created | New note was saved to the database |
| `404` | Not Found | No note matches the given `_id` |
| `429` | Too Many Requests | Rate limiter blocked the request |
| `500` | Internal Server Error | Unexpected database/server error |

### ✅ Analogy

A status code is like a traffic light:
- **2xx** = Green — everything worked.
- **4xx** = Red — the *client* made a mistake (wrong ID, too many requests).
- **5xx** = Red — the *server* broke something internally.

---

## 1.5 How React Sends HTTP Requests to Express

Your project uses the **Axios** library (a popular alternative to the built-in `fetch`). You created a pre-configured instance in `frontend/src/lib/axios.js`:

```js
// frontend/src/lib/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

export default api;
```

**Why create a custom instance?** — So you never have to type the full base URL in every component. Every call automatically targets `http://localhost:5001/api`. You import `api` and just write the path suffix.

### 💻 Real examples from your frontend

```js
// HomePage.jsx — GET all notes
const res = await api.get("/notes");
setNotes(res.data);

// CreatePage.jsx — POST a new note
await api.post("/notes", { title, content });

// NoteCard.jsx (planned) — DELETE a note
await api.delete(`/notes/${note._id}`);
```

### The complete round-trip

```
React (browser)                Express (Node.js)              MongoDB
    |                               |                              |
    |  GET /api/notes               |                              |
    |-----------------------------> |                              |
    |                               |  Note.find()                 |
    |                               |----------------------------> |
    |                               |  [{_id, title, content}]    |
    |                               |<---------------------------- |
    |  200 OK  [{...}, {...}]       |                              |
    |<------------------------------ |                              |
    |                               |                              |
 setNotes(res.data)
```

---

## 1.6 How the Express Server is Set Up (`server.js`)

```js
import express from 'express';
import dotenv from "dotenv";
import cors from "cors";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();  // Load .env variables

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: "http://localhost:5173" }));  // 1
app.use(express.json());                              // 2
app.use(rateLimiter);                                 // 3
app.use((req, res, next) => {                         // 4
  console.log(`Req method is ${req.method} and req url is ${req.url}`);
  next();
});
app.use("/api/notes", notesRoutes);                   // 5

connectDB().then(() => {
  app.listen(PORT, () => console.log('Server is running on port:', PORT));
});
```

Each line with `app.use(...)` registers **middleware** (explained in detail in the Middleware section). Order matters — each piece runs top to bottom.

---

## 1.7 Middleware: The Assembly Line

**Middleware** is a function that sits between the incoming request and your final route handler. Each middleware can:
1. Inspect or modify `req` / `res`
2. End the request (by calling `res.json(...)`)
3. Pass control to the next middleware by calling `next()`

### ✅ Analogy

An airport security queue. Your bag (the request) goes through multiple checkpoints before it reaches the plane (your route handler):
1. X-ray scanner (`cors`) — checks if this passenger is allowed in
2. Document check (`express.json()`) — unpacks and reads the bag contents
3. Additional screening (`rateLimiter`) — checks you haven't flown too many times today
4. Logging desk — writes down who came through
5. Gate (route handler) — final destination

### The three middleware in your project

#### 1. `cors`
```js
app.use(cors({ origin: "http://localhost:5173" }));
```
**What:** CORS (Cross-Origin Resource Sharing) is a browser security rule. By default, browsers block JavaScript from one origin (e.g. `localhost:5173`) making requests to a different origin (`localhost:5001`).

**Why it's needed:** React runs on port 5173, Express on port 5001 — different ports = different origins. Without CORS, every Axios call from React would be blocked by the browser.

**What it does:** Adds an `Access-Control-Allow-Origin: http://localhost:5173` header to every response, telling the browser "this is allowed."

#### 2. `express.json()`
```js
app.use(express.json());
```
**What:** Parses the raw text body of incoming requests and converts it into a JavaScript object available at `req.body`.

**Why it's needed:** When React sends `await api.post("/notes", { title, content })`, Axios serialises that object to a JSON string and puts it in the request body. Without this middleware, `req.body` would be `undefined` in your controller.

#### 3. `rateLimiter` (custom middleware)
```js
// middleware/rateLimiter.js
const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("my-limit-key");
    if (!success) {
      return res.status(429).json({ message: "Too many requests. Please try again later." });
    }
    next(); // everything OK, continue to the route
  } catch (error) {
    console.error("Error in rate limiter middleware:", error);
    next(error);
  }
};
```
**What:** Counts requests using Upstash Redis (a cloud key-value store). If a client exceeds the limit (10 requests per 20 seconds as configured), it returns a `429` response immediately — the route handler is never reached.

**Why it's needed:** Without rate limiting, a malicious user (or a buggy loop) could send thousands of requests per second, overloading your database.

**The `next()` pattern:** Notice the three paths:
- Rate limit exceeded → `res.status(429).json(...)` — request stops here
- Error in the limiter → `next(error)` — passes error to Express's error handler
- All clear → `next()` — request continues to the next middleware/route

---

## 1.8 Error Handling Pattern

Every controller in this project uses the same `try/catch` pattern:

```js
// From getAllNotes
export async function getAllNotes(req, res) {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).json({
      message: "Error fetching notes",
      error: error.message
    });
  }
}
```

**The two possible outcomes:**
- `try` block succeeds → send `200`/`201` with data
- `catch` catches an exception → log it server-side, send `500` with a safe error message

**Why not expose the full error object?** — In production you'd never send `error.message` to the client, because it can leak internal implementation details. This project is for learning, so it's acceptable for now.

---

## ❓ Comprehension Questions — HTTP & Backend

1. What is the difference between `req.body` and `req.params`? Give a real example from this project for each.
2. Why does your project need the `cors` middleware? What would happen if you removed it?
3. A user creates a note and gets a `500` response. Walk through every possible reason this could happen.
4. What does `next()` do inside a middleware? What happens if you forget to call it?
5. Why does `createNotes` respond with `201` instead of `200`? What is the semantic difference?

---

## 🚀 What to Learn Next

- **Environment variables in production** — how to set `PORT` and `MONGO_URI` on a real server (Render, Railway, etc.)
- **Express error-handling middleware** — a special 4-argument middleware `(err, req, res, next)` to centralise error responses
- **Input validation with Zod or express-validator** — never trust `req.body` without validating it first
- **Authentication middleware** — how JWT tokens are verified before reaching protected routes
- **HTTP/2 and HTTPS** — why production apps need SSL and how it changes the protocol
