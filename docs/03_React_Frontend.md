# ⚛️ Part 3: React Frontend

> **Mentor note:** React's job is to build the UI and keep it in sync with data. Forget "webpages" — think of React as a machine that turns data (state) into HTML automatically. Change the data, the UI updates. That's the core idea.

---

## 3.1 How React Starts (`main.jsx`)

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </StrictMode>
);
```

### What each piece does

**`createRoot(document.getElementById("root"))`** — finds the single `<div id="root">` in `index.html` and hands it over to React. From this point on, React controls everything inside that div.

**`<StrictMode>`** — a development-only wrapper that double-renders components and runs effects twice to help you catch bugs early. Has zero effect in production.

**`<BrowserRouter>`** — wraps the entire app with React Router's context. Without this, `<Routes>`, `<Route>`, `<Link>`, and `useNavigate` would not work. Think of it as the "routing engine" — it watches the browser URL and tells your app which page to show.

**`<Toaster />`** — renders an invisible container at the top of the page. When you call `toast.success(...)` or `toast.error(...)` anywhere in the app, this container displays the notification bubble. It lives outside `<App />` so it can overlay everything.

---

## 3.2 Folder Structure — Why It's Organised This Way

```
frontend/src/
├── App.jsx          ← Root component: defines all routes
├── main.jsx         ← Entry point: mounts React to the DOM
├── index.css        ← Global styles (Tailwind directives)
│
├── pages/           ← Full-screen views, one per URL
│   ├── HomePage.jsx
│   ├── CreatePage.jsx
│   └── NoteDetailPage.jsx
│
├── components/      ← Reusable UI pieces used across pages
│   ├── Navbar.jsx
│   ├── NoteCard.jsx
│   └── RateLimitedUI.jsx
│
└── lib/             ← Non-UI helpers and utilities
    ├── axios.js     ← Pre-configured HTTP client
    └── utils.js     ← Pure helper functions (e.g. formatDate)
```

**Why separate `pages/` from `components/`?**
- **Pages** are routed — each one corresponds to a URL. They own business logic (data fetching, state).
- **Components** are reusable UI building blocks. They receive props and render output. They don't know about URLs or which page they're on.

This separation means you can drop `NoteCard` onto any page in the future without modification.

---

## 3.3 Every Component Explained

### `App.jsx` — The Router Shell

```jsx
const App = () => {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 -z-10 ..." />  {/* background gradient */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/notes/:id" element={<NoteDetailPage />} />
      </Routes>
    </div>
  );
};
```

**Responsibility:** Define every URL in the application. React Router reads the current URL and renders the matching `element`. The background gradient div is rendered on every page since it's outside `<Routes>`.

**`/notes/:id`** — the `:id` is a **URL parameter** (dynamic segment). When someone visits `/notes/664abc123`, React Router extracts `664abc123` and makes it available via the `useParams()` hook inside `NoteDetailPage`.

---

### `HomePage.jsx` — The Notes List

```jsx
const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (err) {
        if (err.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("An error occurred while fetching notes");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}
      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div>Loading notes...</div>}
        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

**Responsibility:** Fetch all notes from the API on mount, display them in a grid, and handle loading/error/rate-limit states.

#### State breakdown

| State variable | Initial value | Purpose |
|---|---|---|
| `isRateLimited` | `false` | Shows `<RateLimitedUI />` when backend returns 429 |
| `notes` | `[]` | The array of note objects from the database |
| `loading` | `true` | Shows "Loading notes..." text while waiting for the API |

#### The `useEffect` explained

```jsx
useEffect(() => {
  fetchNotes();
}, []);   // ← empty dependency array
```

- `useEffect` with `[]` runs **once**, immediately after the component mounts (appears on screen for the first time).
- It's the equivalent of "when this page loads, go fetch the data."
- Why not fetch directly in the component body? — React renders components potentially many times. Putting an API call directly in the body would fire on every render. `useEffect` lets you control *when* side effects run.

#### Error handling: `err.response?.status === 429`
- `?.` is optional chaining — if `err.response` is `undefined` (e.g. the server is completely unreachable), this doesn't throw, it just evaluates to `undefined`.
- A `429` specifically means rate-limited, so the component shows the `<RateLimitedUI />` component instead of a generic error toast.

#### `.map()` + `key` prop
```jsx
{notes.map((note) => (
  <NoteCard key={note._id} note={note} />
))}
```
`.map()` transforms the array of note objects into an array of `<NoteCard>` JSX elements. The `key` prop (using MongoDB's unique `_id`) helps React efficiently track which cards to add/remove/update when the list changes.

---

### `CreatePage.jsx` — The Note Form

```jsx
const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();           // stop browser from refreshing the page
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await api.post("/notes", { title, content });
      toast.success("Note created successfully");
      navigate("/");              // redirect to HomePage
    } catch (err) {
      toast.error("Error creating note");
    } finally {
      setLoading(false);
    }
  };
  // ... JSX form
};
```

**Responsibility:** Render a form, manage controlled inputs, submit data to the API, then redirect.

#### Controlled inputs
```jsx
<input
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>
```
This is a **controlled component** — React state (`title`) is the *single source of truth* for the input's value. Every keystroke:
1. Fires `onChange`
2. Calls `setTitle(e.target.value)`
3. React re-renders the component
4. The input displays the new value from state

**Why controlled?** — You can read the value at any time (`title`), validate it, reset it, or pre-fill it — without touching the DOM directly.

#### `e.preventDefault()`
HTML forms, by default, submit by navigating to a new URL (a browser page reload). `e.preventDefault()` stops that browser default, giving React full control over what happens.

#### `useNavigate()`
```jsx
const navigate = useNavigate();
// ...
navigate("/");
```
Programmatically changes the URL — equivalent to the user clicking a link — but called from JavaScript code (e.g. after a successful form submission). No page reload occurs.

#### Loading state on the button
```jsx
<button type="submit" disabled={loading}>
  {loading ? "Creating..." : "Create Note"}
</button>
```
While the API call is in-flight, `loading` is `true`. The button is disabled (prevents double-submission) and its label changes to "Creating..." — clear visual feedback.

---

### `NoteDetailPage.jsx` — Placeholder

```jsx
const NoteDetailPage = () => {
  return <div>NoteDetailPage</div>;
};
```

**Status:** This page is a stub — it was scaffolded but not yet implemented. The route `/notes/:id` points to it, but it doesn't fetch or display note data yet. This is a great place to practice implementing on your own (see the "What to Learn Next" section).

---

### `Navbar.jsx` — The Navigation Header

```jsx
const Navbar = () => {
  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tight">
            ThinkBoard
          </h1>
          <div className="flex items-center gap-4">
            <Link to="/create" className="btn btn-primary">
              <PlusIcon className="size-5" />
              <span>New Note</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
```

**Responsibility:** Render the app bar with the brand name and a navigation link to create a new note.

**`<Link to="/create">`** — React Router's `<Link>` renders as an `<a>` tag but intercepts the click event, updates the URL via the History API, and re-renders the matched `<Route>` — **without a page reload**.

**Why not `<a href="/create">`?** — A regular `<a>` tag causes a full page reload, destroying all React state and re-downloading assets. `<Link>` keeps the app alive and navigation feels instant.

---

### `NoteCard.jsx` — Individual Note Display

```jsx
const NoteCard = ({ note }) => {
  return (
    <Link
      to={`/note/${note._id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200
      border-t-4 border-solid border-[#00FF9D]"
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">{note.title}</h3>
        <p className="text-base-content/70 line-clamp-3">{note.content}</p>
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/60">
            {formatDate(new Date(note.createdAt))}
          </span>
          <div className="flex items-center gap-1">
            <PenSquareIcon className="size-4" />
            <button
              className="btn btn-ghost btn-xs text-error"
              onClick={(e) => handleDelete(e, note._id)}
            >
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
```

**Responsibility:** Display a single note as a clickable card with title, preview of content, creation date, and action buttons.

**Props:** Receives `note` from `HomePage` via `<NoteCard note={note} />`. Props flow **downward** (parent → child).

**`formatDate(new Date(note.createdAt))`** — MongoDB stores `createdAt` as an ISO string (`"2026-04-19T08:00:00.000Z"`). `new Date(...)` converts it to a JavaScript Date object. `formatDate()` (from `lib/utils.js`) then formats it as `"Apr 19, 2026"`.

**⚠️ Bug:** `handleDelete` is called in `onClick` but is never defined in this component. This will throw a `ReferenceError` at runtime when the delete button is clicked. It needs to be implemented (likely as a prop passed from `HomePage`).

**`to={\`/note/${note._id}\`}`** — Note the route mismatch: the card links to `/note/:id` (singular, no `s`), but `App.jsx` defines the route as `/notes/:id` (plural). This means clicking a card leads to a 404 (no matching route). This is a bug to fix.

---

### `RateLimitedUI.jsx` — Rate Limit Message

```jsx
const RateLimitedUI = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-primary/10 border border-primary/30 rounded-lg shadow-md">
        {/* ... icon + message */}
        <h3>Rate Limit Reached</h3>
        <p>You've made too many requests in a short period. Please wait a moment.</p>
      </div>
    </div>
  );
};
```

**Responsibility:** A pure presentational component — it receives no props and renders a static error message. It's shown in `HomePage` when `isRateLimited` is `true`.

---

## 3.4 `lib/utils.js` — Helper Functions

```js
export function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
```

**Why a separate file?** — This function has nothing to do with React (no JSX, no hooks). Putting it in `lib/` keeps components clean. If you need to format a date on 5 different components, you import once from one place.

---

## 3.5 Data Flow Diagram

```
                        [HomePage]
                        state: notes[], loading, isRateLimited
                             |
                    fetches on mount via api.get("/notes")
                             |
                     ┌───────┴───────┐
                     ↓               ↓
              [Navbar]          [NoteCard × N]
               (no props)       note={note}  ← props flow down
                                     |
                              [formatDate()] ← pure utility
```

**Key rule:** Data flows **down** (parent passes props to child). Events flow **up** (child calls a callback function defined by the parent). This is called "lifting state up."

---

## ❓ Comprehension Questions — React

1. Why is `useEffect(() => { ... }, [])` with an empty array the right place to fetch data, rather than calling `api.get()` directly in the component body?
2. What is a "controlled component"? Trace what happens step-by-step when a user types a character in the title input on `CreatePage`.
3. `NoteCard` receives `note` as a prop. If you change `note.title` inside `NoteCard`, does that change the data in `HomePage`? Why or why not?
4. What bug exists in `NoteCard.jsx` related to `handleDelete`? How would you fix it?
5. What is the difference between `navigate("/")` and `<Link to="/">` — when would you use each?

---

## 🚀 What to Learn Next

- **Implement `NoteDetailPage`** — use `useParams()` to get the ID, `useEffect` to fetch the note, and display it. Then add an edit form.
- **Fix `NoteCard`** — implement `handleDelete` by passing a callback prop from `HomePage`: `<NoteCard onDelete={handleDelete} />`
- **Custom hooks** — extract the fetch logic from `HomePage` into a `useNotes()` custom hook to make it reusable
- **`useReducer`** — when state has multiple related pieces (notes + loading + error), `useReducer` is cleaner than 3 separate `useState` calls
- **React Query (TanStack Query)** — a library that manages server state (caching, refetching, loading states) so you don't have to write the `useEffect` + `useState` pattern manually
