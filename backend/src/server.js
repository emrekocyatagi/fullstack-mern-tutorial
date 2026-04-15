import express from 'express';
import notesRoutes from "./routes/notesRoutes.js";
import {connectDB} from "./config/db.js";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001 ;

//middleware, It allows us to  get req.body as JSON object in our Routers. 
// It parses incoming JSON request bodies and makes the data available in req.body. 
// Without this middleware, req.body would be undefined for JSON requests.
app.use(express.json()); //to parse JSON request bodies 
// -- Internally, it calls next() when done parsing
app.use(rateLimiter); // Apply the rate limiter middleware to all routes

app.use((req, res, next) => {
  console.log(`Req method is ${req.method} and req url is ${req.url} `);
  next();
}); 

app.use("/api/notes", notesRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
  console.log('Server is running on port:',PORT);
});
});





