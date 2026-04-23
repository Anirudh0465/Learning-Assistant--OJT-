import express from 'express';
import { getChatHistory, askAIQuestion } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

// We might want to add protect middleware here if the community is only for logged-in users.
// For now, it's open, but let's assume it should be at least somewhat accessible.

const router = express.Router();

// GET /api/chat/history
router.get('/history', getChatHistory);

// POST /api/chat/ask
router.post('/ask', protect, askAIQuestion);

export default router;
