import express from "express";
import {createNotes, deleteNote, getAllNotes, updateNote} from "../controllers/notesController.js"

const router = express.Router(); 

router.get("/", getAllNotes);
router.post("/", createNotes);
router.put("/", updateNote);
router.delete("/:id", deleteNote);

export default router;
