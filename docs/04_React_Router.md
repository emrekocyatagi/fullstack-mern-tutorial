# 🔀 Part 4: React Router

> **Mentor note:** A traditional website has one HTML file per page — click a link, the browser downloads a new file. A React app is one HTML file that *pretends* to have many pages. React Router is the magician that makes this illusion work.

---

## 4.1 What is a Single Page Application (SPA)?

In a traditional website:
1. User clicks a link
2. Browser sends a `GET` request to the server
3. Server returns a **new HTML page**
4. Browser displays it (full reload, all state lost)

In a **Single Page Application (SPA)**:
1. Browser downloads one `index.html` + one JavaScript bundle at startup
2. User clicks a link
3. JavaScript intercepts the click
4. React swaps out which components are rendered
5. URL in the browser bar updates — but **no network request is made, no reload occurs**

### ✅ Analogy

A traditional site is like changing TV channels — the whole screen goes black and reloads. A SPA is like a magic show where the same stage instantly transforms between acts.

---

## 4.2 How React Router Works

React Router uses the browser's **History API** (`window.history.pushState`). When you call `navigate("/create")` or click a `<Link>`, React Router:
1. Calls `window.history.pushState({}, "", "/create")` — updates the URL bar without a reload
2. Notifies all `<Routes>` components that the URL changed
3. React re-renders, displaying the component that matches the new URL

---

## 4.3 Setup in Your Project

### `main.jsx` — wrapping the app

```jsx
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>    {/* ← provides routing context to everything inside */}
      <App />
      <Toaster />
    </BrowserRouter>
  </StrictMode>
);
```

`<BrowserRouter>` creates a React context that stores the current URL and provides routing functions to all child components. Without it, `useNavigate()`, `<Link>`, and `<Routes>` would throw errors.

### `App.jsx` — defining routes

```jsx
import { Route, Routes } from "react-router";

<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/create" element={<CreatePage />} />
  <Route path="/notes/:id" element={<NoteDetailPage />} />
</Routes>
```

- **`<Routes>`** — looks at the current URL and renders only the first `<Route>` whose `path` matches. Think of it as a big `if/else if` for URLs.
- **`<Route path="..." element={...}>`** — the `path` is the URL pattern to match, and `element` is what to render when it matches.

---

## 4.4 Every Route in This Project

### Route 1: `path="/"`
- **Renders:** `<HomePage />`
- **When:** User visits the root URL (`http://localhost:5173/`)
- **What happens:** Fetches all notes from the API and displays them as a grid of cards

### Route 2: `path="/create"`
- **Renders:** `<CreatePage />`
- **When:** User clicks "New Note" in the navbar, or navigates to `/create` directly
- **What happens:** Shows a form to create a new note

### Route 3: `path="/notes/:id"` (dynamic route)
- **Renders:** `<NoteDetailPage />`
- **When:** User clicks on a note card (once implemented)
- **What happens:** The `:id` segment captures the note's MongoDB `_id` from the URL

---

## 4.5 Dynamic Routes: `/notes/:id`

The `:id` in the path is a **URL parameter** — a placeholder that matches any value.

| URL visited | `:id` value |
|---|---|
| `/notes/664abc123def` | `"664abc123def"` |
| `/notes/507f1f77bcf` | `"507f1f77bcf"` |

Inside `NoteDetailPage`, you access the captured value with the `useParams()` hook:

```jsx
import { useParams } from "react-router";

const NoteDetailPage = () => {
  const { id } = useParams();  // id = "664abc123def"

  useEffect(() => {
    api.get(`/notes/${id}`).then(res => setNote(res.data));
  }, [id]);
  // ...
};
```

This `id` is then passed to `api.get("/notes/664abc123def")`, which hits the backend route `GET /api/notes/:id`, which calls `Note.findById("664abc123def")` in MongoDB.

---

## 4.6 `<Link>` vs `<a>` — Critical Difference

| | `<a href="/create">` | `<Link to="/create">` |
|---|---|---|
| Browser behaviour | Full page reload | No reload |
| JavaScript state | **Lost** | **Preserved** |
| Network request | New HTML fetched | No request |
| Feel | Slow | Instant |

**`<Link>` in your project:**

```jsx
// Navbar.jsx
<Link to="/create" className="btn btn-primary">
  <PlusIcon className="size-5" />
  <span>New Note</span>
</Link>

// NoteCard.jsx
<Link to={`/note/${note._id}`}>
  {/* entire card is clickable */}
</Link>

// CreatePage.jsx
<Link to="/" className="btn btn-ghost mb-6">
  <ArrowLeftIcon className="size-5" />
  Back to Notes
</Link>
```

Every time you need a clickable navigation element in a React app, use `<Link>`. Only use `<a>` for external URLs (e.g. `<a href="https://github.com">`).

---

## 4.7 `useNavigate()` — Programmatic Navigation

`useNavigate()` returns a function that changes the URL imperatively (from code, not from a click).

```jsx
// CreatePage.jsx
const navigate = useNavigate();

const handleSubmit = async (e) => {
  // ...
  await api.post("/notes", { title, content });
  navigate("/");  // redirect to home after successful creation
};
```

**When to use `navigate` vs `<Link>`:**
- Use `<Link>` when navigation should happen because the user clicked something
- Use `navigate()` when navigation should happen as a result of some logic (form submission, login success, delete confirmation)

---

## 4.8 Navigating Without Reloading — Step by Step

Here's what happens when a user clicks "New Note" in the Navbar:

```
1. User clicks <Link to="/create">

2. React Router intercepts the click event (no browser navigation)

3. Calls window.history.pushState({}, "", "/create")
   → URL bar now shows /create, but no page reload

4. BrowserRouter detects the URL change

5. <Routes> re-evaluates all <Route> paths against "/create"

6. Matches <Route path="/create" element={<CreatePage />} />

7. React unmounts <HomePage /> and mounts <CreatePage />

8. User sees the Create page — instantly, no network request
```

---

## ❓ Comprehension Questions — React Router

1. What is the difference between a SPA and a traditional multi-page website? What are the trade-offs of each approach?
2. If you change `<BrowserRouter>` to `<HashRouter>`, the URLs would look like `/#/create` instead of `/create`. Why do you think `BrowserRouter` is preferred?
3. How does `NoteDetailPage` know which note to show? Trace the full path from the URL in the browser bar to the MongoDB query.
4. You have `<Route path="/notes/:id">` in `App.jsx` but `NoteCard` links to `/note/:id` (without the `s`). What happens when a user clicks a card? How would you fix this?
5. When should you use `<Link>` and when should you use `useNavigate()`? Give one example of each from this project.

---

## 🚀 What to Learn Next

- **`<NavLink>`** — like `<Link>` but adds an `active` CSS class when the current URL matches, useful for navigation menus
- **Nested routes** — `<Outlet />` lets you have layouts with sub-routes (e.g. a dashboard with sidebar + content area)
- **`useSearchParams()`** — read/write URL query strings (`?search=react&page=2`)
- **Protected routes** — wrap routes in a component that checks authentication and redirects to login if not authenticated
- **`loader` and `action`** functions (React Router v6.4+) — handle data fetching directly in route definitions
