import express from "express";
import {createNotes, deleteNote, getAllNotes, updateNote, getNotesById} from "../controllers/notesController.js"

const router = express.Router(); 

router.get("/", getAllNotes);
router.get("/:id", getNotesById);
router.post("/", createNotes);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
