# 📚 MERN-Stack Lern-Dokumentation: Notizen-App

Willkommen zu deiner persönlichen Lern-Dokumentation! Dieser Guide ist so aufgebaut, dass er dir nicht nur zeigt, *was* der Code macht, sondern *warum* er so geschrieben wurde und wie die einzelnen Teile ineinandergreifen. Stell dir vor, wir sitzen gemeinsam am Bildschirm und gehen das Projekt Schritt für Schritt durch.

---

## 🗺️ Projektübersicht

**Was macht die App?**
Du hast eine klassische Notizen-App gebaut. Sie ermöglicht die sogenannten **CRUD**-Operationen (Create, Read, Update, Delete). Du kannst Notizen ansehen (Read), neue erstellen (Create), bearbeiten (Update) und löschen (Delete). 

**Wie sieht die Architektur aus?**
Die App folgt der klassischen **Client-Server-Architektur**:
1. **Client (Frontend):** Läuft im Browser des Nutzers (React). Hier passiert die Interaktion – Buttons klicken, Formulare ausfüllen.
2. **Server (Backend):** Läuft im Hintergrund auf Node.js (Express). Er nimmt Anfragen vom Frontend entgegen, prüft sie und führt die Logik aus.
3. **Datenbank:** MongoDB speichert die eigentlichen Notizen dauerhaft ab.

*Stell dir das wie in einem Restaurant vor: Der Gast (Frontend) bestellt beim Kellner (Backend), und der Kellner holt das Essen aus der Küche (Datenbank).*

---

## 🛠️ Tech-Stack Erklärung

Warum genau diese vier Technologien (MongoDB, Express, React, Node)? Weil sie alle auf JavaScript basieren! Du musst keine neue Sprache lernen, um das Backend zu schreiben.

*   **Node.js (Die Laufzeitumgebung):** Normalerweise läuft JavaScript nur im Browser. Node.js ist die "Engine", die es erlaubt, JavaScript auf einem Computer (Server) auszuführen.
*   **Express.js (Das Framework):** Node.js alleine ist sehr "roh". Express ist ein Werkzeugkasten, der es extrem einfach macht, Server, Routen und Antworten zu bauen. *Entscheidung:* Es ist der absolute Industriestandard für Node-Backends.
*   **MongoDB (Die Datenbank):** Eine NoSQL-Datenbank. Statt in starren Tabellen wie in Excel (SQL), speichert MongoDB Daten als flexible Dokumente ab, die quasi exakt wie JavaScript-Objekte (JSON) aussehen.
*   **React (Das Frontend):** Eine Bibliothek von Facebook, um Benutzeroberflächen in wiederverwendbare Bausteine (Komponenten) zu zerlegen.

---

## 🗄️ Backend (Node.js + Express)

Das Backend ist das Gehirn der Operation. Schauen wir in den Ordner `backend/src`:

### 1. `server.js` (Der Einstiegspunkt)
Hier startet alles. Der Server wird hochgefahren und konfiguriert.
*   **Middlewares:** Das sind wie Türsteher oder Helfer, die jede Anfrage bearbeiten, bevor sie zur eigentlichen Logik kommt.
    *   `app.use(express.json())`: Ohne diesen Helfer wüsste dein Server nicht, wie er die Daten, die React ihm schickt, lesen soll. Er übersetzt sie in ein Format (`req.body`), das JavaScript versteht.
    *   `app.use(cors(...))`: (Siehe Lernpunkte unten).
    *   `app.use(rateLimiter)`: Schützt deinen Server davor, dass jemand zu viele Anfragen in kurzer Zeit schickt (Spam-Schutz).

### 2. `routes/notesRoutes.js` (Der Wegweiser)
Wenn eine Anfrage wie "Hol mir alle Notizen!" reinkommt (`GET /api/notes`), schaut das System hier nach. Der Router sagt: "Ah, eine GET-Anfrage an `/`? Dafür ist der `getAllNotes`-Controller zuständig!"

### 3. `controllers/notesController.js` (Die ausführende Kraft)
Hier passiert die eigentliche Arbeit. Jeder Controller nimmt eine Anfrage (`req`) und eine Antwort (`res`).
*   *Beispiel `createNotes`:* Er nimmt Titel und Inhalt aus der Anfrage (`req.body`), erstellt eine neue Notiz, speichert sie in der Datenbank und schickt eine Erfolgsmeldung (`res.status(201)`) zurück.

---

## 🍃 Datenbank (MongoDB + Mongoose)

Um mit MongoDB zu sprechen, nutzen wir **Mongoose**. Mongoose ist ein Übersetzer zwischen der Node.js-Welt und der Datenbank.

### `models/Note.js`
Hier definierst du die "Blaupause" für eine Notiz (das **Schema**).
*   **Warum ein Schema?** In MongoDB könntest du theoretisch in eine Notiz einen Titel schreiben und in die nächste ein Rezept. Das Schema zwingt Ordnung auf: Jede Notiz *muss* einen `title` (String) und einen `content` (String) haben.
*   `{timestamps: true}` ist ein toller Mongoose-Trick: Es erstellt automatisch Felder für `createdAt` und `updatedAt`.
*   Am Ende wird das Schema zu einem **Model** kompilliert (`mongoose.model("Note", noteSchema)`). Dieses Model nutzen wir im Controller, um Befehle wie `Note.find()` oder `Note.findByIdAndDelete()` auszuführen.

---

## ⚛️ Frontend (React)

Das Frontend lebt im Browser und wird mit dem "Vite"-Tool zusammengebaut.

### 1. Seiten (`pages/`) und Komponenten (`components/`)
*   **Komponenten** sind kleine, dumme Bausteine, z.B. die `Navbar.jsx` oder die `NoteCard.jsx` (die anzeigt, wie eine einzelne Notiz aussieht).
*   **Seiten** sind die großen Behälter, die Komponenten zusammenfügen, z.B. die `HomePage.jsx` oder `CreatePage.jsx`.

### 2. State Management (`useState`)
In React steuert der *Zustand* (State), was auf dem Bildschirm zu sehen ist.
*   In der `HomePage.jsx` hast du `const [notes, setNotes] = useState([])`. Am Anfang ist die Liste leer. Sobald die Daten vom Backend da sind, rufst du `setNotes(daten)` auf, und React zeichnet die Seite *automatisch* neu, um die Notizen anzuzeigen!

### 3. API-Aufrufe (`useEffect` & Axios)
*   Wie bekommt React die Notizen beim Start? Durch `useEffect`. Dieser Hook sagt React: "Sobald diese Seite fertig geladen ist, führe bitte diese Funktion einmalig aus."
*   In dieser Funktion benutzt du `api.get("/notes")` (mithilfe von **Axios**, einem Tool, das HTTP-Anfragen einfacher macht als das eingebaute `fetch`), um das Backend zu fragen.

### 4. Routing (`App.jsx`)
Dank `react-router` lädt die Seite nicht mehr neu, wenn du umherklickst. Es tut nur so! Die `<Routes>` tauschen einfach dynamisch die Komponente aus (z.B. `<HomePage />` durch `<CreatePage />`), je nachdem, was oben in der URL steht.

---

## 🔗 Frontend ↔ Backend Kommunikation

Die beiden Seiten sprechen über eine **REST API** miteinander. Sie nutzen HTTP-Methoden wie Vokabeln:
*   `GET` = Gib mir Daten (Lesen)
*   `POST` = Hier sind neue Daten (Erstellen)
*   `PUT` / `PATCH` = Aktualisiere diese Daten (Ändern)
*   `DELETE` = Lösche das (Löschen)

**Schritt für Schritt (Beispiel Notiz erstellen):**
1. Du füllst in React (Frontend) das Formular aus und klickst auf "Speichern".
2. Die Funktion `handleSubmit` in `CreatePage.jsx` startet. Sie verpackt deine Eingaben in ein Paket: `{ title: "Hallo", content: "Welt" }`.
3. Sie schickt dieses Paket per Postbote (Axios) an das Backend: `api.post("/notes", paket)`.
4. Der Backend-Server (auf Port 5001) nimmt das Paket an. Die `server.js` leitet es an `notesRoutes.js` weiter, und die leitet es an `createNotes` weiter.
5. Das Backend packt das Paket aus, gibt es der Datenbank (Mongoose), und sagt: "Speichern!".
6. Die Datenbank meldet "Fertig!". Das Backend schickt ein "Okay!" (`status 201`) ans Frontend zurück.
7. Das Frontend empfängt das "Okay", freut sich (zeigt ein Toast-Popup an) und navigiert dich zurück zur Startseite.

---

## 💡 Lernpunkte & Konzepte

Hier sind drei extrem wichtige Konzepte, die in diesem Projekt versteckt sind:

1.  **CORS (Cross-Origin Resource Sharing):** 
    Browser sind paranoid. Wenn dein Frontend auf `localhost:5173` läuft, verbietet der Browser aus Sicherheitsgründen, Daten an `localhost:5001` (Backend) zu senden. Das Backend *muss* explizit sagen: "Hey Browser, `localhost:5173` ist ein Freund, lass den durch!". Genau das macht die `cors()` Middleware in der `server.js`.
2.  **`async` / `await`:**
    JavaScript ist ungeduldig. Wenn du die Datenbank etwas fragst, dauert das ein paar Millisekunden. JavaScript würde normalerweise einfach weiterlaufen und den Rest vom Code ausführen, *bevor* die Antwort da ist. `await` zwingt JavaScript an dieser Zeile zu warten: "Halt! Mach erst weiter, wenn die Datenbank geantwortet hat." (Deshalb steht das immer bei Datenbank- und API-Aufrufen).
3.  **Abhängigkeiten-Array in `useEffect`:**
    In der `HomePage.jsx` steht am Ende des `useEffect` ein leeres Array `[]`. Das ist überlebenswichtig! Es bedeutet: Führe diesen Code *nur ein einziges Mal* nach dem ersten Laden aus. Ohne das `[]` würde React bei jeder winzigen Änderung (z.B. einem Hover-Effekt) erneut das Backend anfragen – und es damit komplett überlasten.

---

## ❓ Verständnisfragen

Versuche diese Fragen für dich selbst zu beantworten, um dein Wissen zu testen:

**Backend & Datenbank:**
1. Was würde passieren, wenn du in der `server.js` die Zeile `app.use(express.json())` löschst und versuchst, eine Notiz zu erstellen?
2. Warum trennen wir Controller und Routen in zwei verschiedene Dateien, anstatt alles in die `server.js` zu schreiben?
3. Woher weiß MongoDB, dass ein neues Dokument die Felder `createdAt` und `updatedAt` bekommen soll?

**Frontend & Kommunikation:**
4. Was ist der Unterschied zwischen dem State (`useState`) in React und der Datenbank (MongoDB)? Wo leben beide?
5. Wenn du im Frontend `api.delete('/notes/123')` aufrufst, welcher Controller im Backend fängt das auf und was macht `req.params.id` dabei?
6. Warum rufen wir Backend-Daten innerhalb eines `useEffect` ab und schreiben den `axios`-Aufruf nicht einfach direkt oben in die Komponente?

---

## 🚀 Nächste Schritte

Du hast jetzt ein solides Fundament! Um tiefer in den MERN-Stack einzutauchen, hier ein paar Ideen, was du als Nächstes bauen oder lernen könntest:

*   **Validierung:** Momentan vertraut das Backend blind darauf, dass das Frontend korrekte Daten schickt. Lerne Tools wie `Zod` oder `Joi` kennen, um Daten im Backend zu validieren, *bevor* sie in die Datenbank kommen.
*   **Authentifizierung (Login):** Füge User Accounts hinzu. Lerne, wie **JWT (JSON Web Tokens)** funktionieren, damit jeder User nur seine *eigenen* Notizen sehen kann.
*   **Pagination (Seitennummerierung):** Was passiert, wenn du 10.000 Notizen hast? Aktuell würden alle geladen werden. Versuche, immer nur 10 Notizen auf einmal vom Backend zu laden (z.B. mit `/api/notes?page=1&limit=10`).
*   **Global Error Handling:** Im Backend kopieren wir oft `try/catch`-Blöcke. Es gibt elegante Wege in Express, Fehler zentral an einer Stelle zu fangen.
