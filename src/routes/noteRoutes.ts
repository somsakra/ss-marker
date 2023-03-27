import { Router } from "express";
import checkAuth from "../middleware/auth";
import {
  getAllNote,
  createNewNote,
  getNote,
  deleteNote,
} from "../controllers/noteController";

const router = Router();

router.get("/", checkAuth, getAllNote);

router.post("/", checkAuth, createNewNote);

router.get("/:NoteId", checkAuth, getNote);

// router.patch("/:NoteId", checkAuth, NotesController.note_update_note);

router.delete("/:NoteId", checkAuth, deleteNote);

export default router;
