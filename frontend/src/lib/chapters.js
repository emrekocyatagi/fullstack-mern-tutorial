import ch1 from "../docs/01_HTTP_and_Backend.md?raw";
import ch2 from "../docs/02_MongoDB_and_Mongoose.md?raw";
import ch3 from "../docs/03_React_Frontend.md?raw";
import ch4 from "../docs/04_React_Router.md?raw";
import ch5 from "../docs/05_Architecture_and_Bugs.md?raw";

export const chapters = [
  {
    id: "01-http-backend",
    number: "01",
    title: "HTTP & the Express Backend",
    emoji: "🌐",
    description: "HTTP methods, req/res objects, status codes, middleware, CORS — how the client and server talk to each other.",
    readTime: "15 min",
    content: ch1,
    questions: [
      {
        question: "What is the difference between req.body and req.params? Give a real example from this project for each.",
        answer: "req.body holds data sent inside the request body — e.g. { title, content } when React POSTs a new note. It requires express.json() middleware to parse it. req.params holds URL path variables — e.g. req.params.id = '664abc...' when the route is GET /api/notes/:id and the user visits /api/notes/664abc.",
      },
      {
        question: "Why does your project need the cors middleware? What would happen if you removed it?",
        answer: "React runs on port 5173, Express on port 5001. Different ports = different origins. Browsers block cross-origin requests by default (CORS policy). Without the cors middleware, every Axios call from React would be blocked by the browser before it even reaches Express — you'd see 'CORS error' in the console and no data would load.",
      },
      {
        question: "What does next() do inside a middleware? What happens if you forget to call it?",
        answer: "next() passes control to the next middleware in the chain. If you forget to call it (and also don't call res.json()), the request just hangs forever — the browser waits indefinitely for a response that never comes. Always either call next() to continue or res.json() to end the request.",
      },
      {
        question: "Why does createNotes respond with 201 instead of 200? What is the semantic difference?",
        answer: "200 means 'OK — request succeeded and here is the result'. 201 means 'Created — a new resource was successfully created'. Using 201 is more precise and communicates intent. Some tools and frameworks treat 201 differently (e.g. triggering a redirect to the new resource's URL).",
      },
      {
        question: "A user creates a note and gets a 500 response. Walk through every possible reason this could happen.",
        answer: "1) MongoDB connection dropped — Mongoose can't reach Atlas. 2) Validation failed — but that would be a Mongoose ValidationError (still caught as 500 here). 3) Upstash Redis is unreachable — the rate limiter would catch it and call next(error). 4) A JavaScript bug in the controller (e.g. typo in a variable name). 5) The server ran out of memory. In production you'd log the full error.message to find the exact cause.",
      },
    ],
  },
  {
    id: "02-mongodb-mongoose",
    number: "02",
    title: "MongoDB & Mongoose",
    emoji: "🗄️",
    description: "Document databases, schemas, models, every Mongoose query used in this project, and the Upstash Redis rate limiter.",
    readTime: "12 min",
    content: ch2,
    questions: [
      {
        question: "What is the difference between a Mongoose Schema and a Mongoose Model? Can you have one without the other?",
        answer: "A Schema defines the shape and rules of a document (field names, types, required, timestamps). A Model is a JavaScript class built from a Schema — it represents a collection and provides query methods like .find(), .save(), .findByIdAndDelete(). You need a Schema to create a Model. The Schema alone is just a blueprint; the Model is what you use to actually talk to MongoDB.",
      },
      {
        question: "What does { new: true } do in findByIdAndUpdate? What would happen without it?",
        answer: "By default, Mongoose returns the document as it was BEFORE the update. { new: true } tells Mongoose to return the updated version instead. Without it, your updateNote controller would send back the old title/content in the response, even though the database was correctly updated — confusing for the client.",
      },
      {
        question: "The _id field is never defined in your schema — where does it come from?",
        answer: "MongoDB generates _id automatically for every document as an ObjectId (a 12-byte unique identifier). Mongoose surfaces this as the _id field. You don't need to define it — it's always there. This is what you use in routes like /api/notes/:id and in Mongoose methods like Note.findById().",
      },
      {
        question: "Why does the project use process.exit(1) if the database connection fails instead of just logging the error?",
        answer: "A server with no database connection is worse than no server at all — it would accept requests but fail every single one with a 500 error. process.exit(1) shuts down immediately with a non-zero exit code (signalling failure), which causes deployment platforms like Render to detect the crash and alert you. Logging and continuing would silently serve broken responses.",
      },
      {
        question: "Why is { timestamps: true } better than manually setting createdAt in the controller?",
        answer: "1) It's automatic — you can't forget to set it. 2) updatedAt is also managed automatically — you'd have to remember to update it manually on every PUT. 3) Mongoose handles the timezone/format correctly. 4) It's a single option vs extra code in every controller function. Less code = fewer bugs.",
      },
    ],
  },
  {
    id: "03-react-frontend",
    number: "03",
    title: "React Frontend",
    emoji: "⚛️",
    description: "Every component explained, useState and useEffect patterns, controlled inputs, props and data flow, and how React calls the API.",
    readTime: "18 min",
    content: ch3,
    questions: [
      {
        question: "Why is useEffect(() => { ... }, []) the right place to fetch data — not the component body?",
        answer: "React can render a component many times (state changes, parent re-renders, StrictMode double-renders). Code in the component body runs on every render. useEffect with [] runs exactly once after the first render (mount). Putting an API call in the component body would fire it on every render — potentially hundreds of times and causing infinite loops if setNotes triggers a re-render.",
      },
      {
        question: "What is a 'controlled component'? Trace what happens when a user types a character in the title input on CreatePage.",
        answer: "A controlled component is one where React state is the single source of truth for the input's value — not the DOM. When the user types: 1) The browser fires the onChange event. 2) The handler calls setTitle(e.target.value). 3) React re-renders CreatePage with the new title value. 4) The input's value prop is set to the new title — so the input displays what's in state. The DOM never 'owns' the value.",
      },
      {
        question: "NoteCard receives 'note' as a prop. If you change note.title inside NoteCard, does that change the data in HomePage?",
        answer: "No. Props are passed by reference for objects, but you should never mutate them directly. More importantly: even if you mutated the object in memory, React's state in HomePage still holds the original reference — it would not re-render, and the change would not be reflected anywhere. Data only flows down via props; changes must flow up via callback functions.",
      },
      {
        question: "What is the difference between navigate('/') and <Link to='/'>? When would you use each?",
        answer: "Both change the URL without a page reload. <Link> is for user-triggered navigation from a click — it renders as an <a> tag. navigate() is for programmatic navigation from JavaScript logic — e.g. after a form submits successfully ('Note created') you want to automatically redirect. Use <Link> for buttons/links, navigate() for logic-driven redirects.",
      },
      {
        question: "NoteCard receives setNotes as a prop for deletion. Why is setNotes passed down instead of onDelete(id)?",
        answer: "Both work, but passing setNotes gives NoteCard direct access to update the state optimistically using the functional update pattern: setNotes(prev => prev.filter(n => n._id !== id)). This is a common React pattern called 'state setter as prop'. Passing a callback onDelete(id) is also valid and arguably cleaner — it's a design choice with trade-offs either way.",
      },
    ],
  },
  {
    id: "04-react-router",
    number: "04",
    title: "React Router",
    emoji: "🔀",
    description: "Single Page Applications explained, every route in this project, Link vs a tag, useNavigate, useParams, and dynamic routes.",
    readTime: "10 min",
    content: ch4,
    questions: [
      {
        question: "What is the difference between a SPA and a traditional multi-page website?",
        answer: "Traditional: each URL = a separate HTML file downloaded from the server. Clicking a link causes a full page reload. All JavaScript state is lost. SPA: one HTML file + one JS bundle downloaded once. Clicking a link is intercepted by React Router, which swaps components without a network request. Navigation is instant, state is preserved. Trade-off: SPAs need extra setup for SEO and the initial load can be larger.",
      },
      {
        question: "How does NoteDetailPage know which note to show? Trace the full path from URL to MongoDB.",
        answer: "1) User visits /notes/664abc. 2) React Router matches <Route path='/notes/:id'> and renders NoteDetailPage. 3) useParams() returns { id: '664abc' }. 4) useEffect calls api.get('/notes/664abc'). 5) Axios sends GET http://localhost:5001/api/notes/664abc. 6) Express routes to getNotesById controller. 7) Note.findById('664abc') queries MongoDB. 8) The document is returned, setNote(res.data) stores it, component re-renders with the note data.",
      },
      {
        question: "What happens when you use <a href='/create'> instead of <Link to='/create'>?",
        answer: "The browser treats it as a full navigation — it sends a GET request to the server for /create, discards the current JS bundle, downloads a new page, and re-initialises everything. In production on Render, Express serves index.html for all routes — so the page would load, but all React state is gone and performance is worse. React Router's Link intercepts the click and uses the History API instead, keeping the app alive.",
      },
      {
        question: "What is BrowserRouter and why does it need to wrap the entire app?",
        answer: "BrowserRouter creates a React context that makes routing information (current URL, navigation functions) available to all components below it. useNavigate(), useParams(), <Link>, and <Routes> all read from this context. If any of them are rendered outside BrowserRouter, they throw an error because the context doesn't exist. It must be at or near the top of the component tree.",
      },
      {
        question: "When should you use <Link> vs useNavigate()? Give one example of each from this project.",
        answer: "<Link>: when navigation happens because the user clicked something — e.g. the 'New Note' button in Navbar, or the 'Back to Notes' button in CreatePage. useNavigate(): when navigation happens as a result of logic completing — e.g. in CreatePage after api.post() succeeds, navigate('/') redirects automatically. Rule: user gesture = Link, code event = navigate().",
      },
    ],
  },
  {
    id: "05-architecture-bugs",
    number: "05",
    title: "Architecture & Data Flow",
    emoji: "🏗️",
    description: "The complete system diagram, a step-by-step request trace, the MVC pattern, all 3 bugs found and fixed, and what to build next.",
    readTime: "14 min",
    content: ch5,
    questions: [
      {
        question: "Why does the Express middleware order matter? What would break if express.json() came after the route definitions?",
        answer: "Middleware runs in the order it is registered. If express.json() came after the routes, it would never run before a request reaches the route handlers. Every controller that reads req.body would get undefined — createNotes and updateNote would receive { title: undefined, content: undefined }, fail Mongoose validation, and return 500 errors for all POST and PUT requests.",
      },
      {
        question: "What is the MVC pattern and how does it map to the backend files?",
        answer: "MVC = Model, View, Controller. Model: Note.js — defines the data schema and talks to MongoDB. View: the JSON response — in an API there's no HTML view, the 'view' is the data you return. Controller: notesController.js — receives the request, calls the model, decides what to return. Router: notesRoutes.js is a 4th piece that maps URLs to controllers. Separating these makes the code easier to read, test, and modify.",
      },
      {
        question: "Why are environment variables stored in .env instead of directly in the code?",
        answer: "1) Security: .env is in .gitignore — secrets never appear in your git history or on GitHub. Anyone who forks your repo can't access your database. 2) Flexibility: you can have different values for dev/staging/prod without changing code. 3) Convention: hosting platforms (Render, Vercel) provide a UI to set env vars, which then get injected at runtime. If you hardcode MONGO_URI, a repo leak exposes your entire database.",
      },
      {
        question: "The rate limiter uses a single key 'my-limit-key' for all users. What problem does this cause?",
        answer: "All users share one bucket of 100 requests per 60 seconds. If one person makes 50 requests, everyone else only has 50 left until the window resets. The fix is to use a per-user identifier as the key — typically the client's IP address: ratelimit.limit(req.ip). This gives each user their own independent quota.",
      },
      {
        question: "In production, how does the React app get served? Trace the request for a user visiting the homepage.",
        answer: "1) User visits https://fullstack-mern-tutorial.onrender.com/. 2) Browser sends GET /. 3) Express checks if NODE_ENV === 'production' — yes. 4) express.static serves files from frontend/dist/. 5) / matches index.html (the built React app). 6) Browser downloads index.html + the JS bundle. 7) React Router initialises, matches path / to <HomePage>. 8) HomePage's useEffect fires — sends GET /api/notes to the same origin. 9) Express routes /api/notes to getAllNotes controller. Notes load.",
      },
    ],
  },
];

export const getChapterById = (id) => chapters.find((c) => c.id === id);
export const getChapterIndex = (id) => chapters.findIndex((c) => c.id === id);

const PROGRESS_KEY = "thinkboard_learn_progress";
export const getProgress = () => JSON.parse(localStorage.getItem(PROGRESS_KEY) || "[]");
export const markChapterRead = (id) => {
  const progress = getProgress();
  if (!progress.includes(id)) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...progress, id]));
  }
};
