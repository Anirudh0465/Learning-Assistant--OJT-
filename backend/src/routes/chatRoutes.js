import express from 'express';
import { getChatHistory, askAIQuestion } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/history', getChatHistory);
router.post('/ask', protect, askAIQuestion);

export default router;
