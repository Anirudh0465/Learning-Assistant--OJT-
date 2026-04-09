import express from "express";
import {
  generateQuizFromPdf,
  generateQuizFromDocument,
  getQuizById,
  submitQuiz,
  getQuizzes
} from "../controllers/quizControllers.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate/pdf/:id", protect, generateQuizFromPdf);
router.post("/generate/document/:id", protect, generateQuizFromDocument);
router.get("/:id", protect, getQuizById);
router.post("/:id/submit", protect, submitQuiz);
router.get("/", protect, getQuizzes);

export default router;
