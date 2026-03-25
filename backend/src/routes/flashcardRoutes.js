import express from "express";
import { createFlashcards,getFlashcards  } from "../controllers/flashcardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post('/generate/:documentId', protect, createFlashcards);
router.get("/", protect, getFlashcards);
export default router;