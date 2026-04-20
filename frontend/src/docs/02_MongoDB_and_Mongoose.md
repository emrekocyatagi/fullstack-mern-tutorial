# 🗄️ Part 2: MongoDB & Mongoose

> **Mentor note:** If Express is the waiter, MongoDB is the kitchen's filing cabinet — it stores all your data permanently. Mongoose is the filing system that enforces rules about what can go in each drawer.

---

## 2.1 What is MongoDB?

**MongoDB** is a **NoSQL** document database. Instead of storing data in rows and columns (like a spreadsheet / SQL database), it stores data as **JSON-like documents** inside **collections**.

### SQL vs MongoDB — side by side

| SQL concept | MongoDB equivalent | In your project |
|---|---|---|
| Database | Database | `thinkboard` (or whatever your URI names it) |
| Table | Collection | `notes` |
| Row | Document | One note object |
| Column | Field | `title`, `content`, `createdAt` |

### What a note document looks like in MongoDB

```json
{
  "_id": "664abc123def456ghi789jkl",
  "title": "My First Note",
  "content": "This is the content of my note.",
  "createdAt": "2026-04-19T08:00:00.000Z",
  "updatedAt": "2026-04-19T08:00:00.000Z",
  "__v": 0
}
```

Notice `_id` — MongoDB generates this unique identifier automatically. It is the primary key of the document, and you use it in routes like `/api/notes/:id`.

### ✅ Analogy

A SQL database is like a spreadsheet — rigid columns, every row has the same shape. MongoDB is like a folder of sticky notes — each note can have different fields, and you can add new fields without redesigning the whole structure.

---

## 2.2 Connecting to MongoDB (`config/db.js`)

```js
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1); // exit with failure
  }
};
```

### How it's called in `server.js`

```js
connectDB().then(() => {
  app.listen(PORT, () => console.log('Server is running on port:', PORT));
});
```

**Why start the server only after connecting?** — If the database connection fails, you don't want a server accepting requests it can't fulfil. By chaining `.then()`, the server only starts listening when the connection is confirmed.

**`process.exit(1)`** — If the connection fails, we exit the Node.js process entirely with exit code `1` (meaning "failure"). This is intentional — a server with no database is worse than no server at all.

**`process.env.MONGO_URI`** — The connection string is stored in the `.env` file, not in the code. This is critical for security: the `.env` file is in `.gitignore` so it is never committed to GitHub.

---

## 2.3 What is Mongoose?

**Mongoose** is an **ODM (Object Document Mapper)** — a library that sits between your Node.js code and MongoDB. It provides:

1. **Schemas** — define the shape and validation rules for documents
2. **Models** — JavaScript classes that map to a collection and provide query methods
3. **Type casting** — ensures a field marked as `String` is always stored as a string

### ✅ Analogy

Mongoose is like a customs form at the airport. Before any document enters the MongoDB "country", it must fill in the required fields (title, content), and empty or wrong-type fields are rejected.

---

## 2.4 The Note Schema & Model (`models/Note.js`)

```js
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,   // cannot be empty
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }  // automatically adds createdAt + updatedAt
);

const Note = mongoose.model("Note", noteSchema);

export default Note;
```

### Breaking it down

**`new mongoose.Schema({...})`** — defines the "contract" for every document in the `notes` collection. Any document that doesn't satisfy `required: true` will throw a `ValidationError` before reaching the database.

**`{ timestamps: true }`** — a Mongoose shortcut that automatically manages two fields:
- `createdAt` — set once when the document is first saved
- `updatedAt` — updated every time the document is modified

**`mongoose.model("Note", noteSchema)`** — this does two things:
1. Creates a JavaScript class (`Note`) with built-in methods: `.find()`, `.findById()`, `.save()`, etc.
2. Tells Mongoose to use (or create) a collection named `notes` in MongoDB (Mongoose automatically lowercases and pluralises the model name: `"Note"` → `notes` collection).

---

## 2.5 Mongoose Queries Used in This Project

Every controller uses Mongoose model methods. Here's each one explained:

### `Note.find().sort({ createdAt: -1 })` — getAllNotes
```js
const notes = await Note.find().sort({ createdAt: -1 });
```
- `.find()` with no arguments returns **all** documents in the collection
- `.sort({ createdAt: -1 })` orders results newest-first (`-1` = descending, `1` = ascending)
- Returns an **array** of Note objects

### `Note.findById(req.params.id)` — getNotesById
```js
const note = await Note.findById(req.params.id);
```
- Takes a MongoDB `_id` string and finds the matching document
- Returns **one** Note object, or `null` if not found
- That's why you check `if (!note)` right after — a `null` means "not found" → `404`

### `new Note({...}) + .save()` — createNotes
```js
const newNote = new Note({ title, content });
await newNote.save();
```
- `new Note({...})` creates a new instance in memory (not in the DB yet)
- `.save()` validates against the schema, then inserts it into MongoDB
- After saving, `newNote._id` is populated (MongoDB generated an ID)

**Alternative:** `Note.create({ title, content })` does both in one step. Your code explicitly separates them — both approaches are correct.

### `Note.findByIdAndUpdate(id, data, options)` — updateNote
```js
const updatedNote = await Note.findByIdAndUpdate(
  req.params.id,
  { title, content },
  { new: true }
);
```
- Finds the document by ID, applies the update, returns the result
- **`{ new: true }`** — without this option, Mongoose returns the *old* document (before the update). `new: true` tells it to return the *updated* document instead.

### `Note.findByIdAndDelete(req.params.id)` — deleteNote
```js
const deletedNote = await Note.findByIdAndDelete(req.params.id);
```
- Finds and removes the document in a single atomic operation
- Returns the deleted document (or `null` if not found)
- That's why you check `if (!deletedNote)` → `404`

---

## 2.6 The `async/await` Pattern

All database operations are **asynchronous** — they take time (network round-trips to MongoDB). `async/await` makes asynchronous code read like synchronous code.

```js
// Without async/await (callback hell)
Note.find({}, (err, notes) => {
  if (err) { /* handle */ }
  Note.sort(notes, (err, sorted) => { /* ... */ });
});

// With async/await (clean and readable)
const notes = await Note.find().sort({ createdAt: -1 });
```

The `await` keyword pauses execution of the function until the Promise resolves. The function must be declared `async` to use `await` inside it.

---

## 2.7 The Rate Limiter: Upstash Redis (`config/upstash.js`)

```js
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const rateLimit = new Ratelimit({
  redis: Redis.fromEnv(),               // connects using env vars
  limiter: Ratelimit.slidingWindow(10, "20 s"),  // 10 requests per 20 seconds
});

export default rateLimit;
```

**Why Redis for rate limiting?** — Redis is an in-memory key-value store. It's extremely fast at counting (increment a counter, check if it's over the limit). Storing this in MongoDB would be too slow and wasteful.

**Sliding Window algorithm** — Instead of a fixed window ("10 requests per 20-second block"), the sliding window counts requests in the *last 20 seconds from now*. This prevents the "edge spike" problem where a user can make 10 requests at 0:19 and 10 more at 0:21 (20 requests in 2 seconds).

**`"my-limit-key"`** — Currently all requests share one bucket. The comment in your code notes this should eventually be replaced with a per-user identifier (e.g. an IP address or user ID) so each user gets their own limit.

---

## ❓ Comprehension Questions — MongoDB & Mongoose

1. What is the difference between a Mongoose **Schema** and a Mongoose **Model**? Can you have one without the other?
2. Why does your project use `process.exit(1)` if the database connection fails instead of just logging the error?
3. What does `{ new: true }` do in `findByIdAndUpdate`? What would happen without it?
4. The `_id` field is never defined in your schema — where does it come from?
5. Why is `{ timestamps: true }` a better approach than manually setting `createdAt` in your controller?

---

## 🚀 What to Learn Next

- **Mongoose validation** — add `minLength`, `maxLength`, `enum`, and custom validators to your schema
- **Mongoose populate** — when you have multiple collections that reference each other (e.g. a `User` who owns many `Notes`)
- **Indexes** — add `index: true` to fields you query often to make searches faster
- **MongoDB Atlas** — the cloud-hosted version you're likely using via `MONGO_URI`
- **Transactions** — how to make multiple database operations atomic (all succeed or all fail)
