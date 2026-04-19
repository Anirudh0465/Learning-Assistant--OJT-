import express from 'express';
import { getChatHistory } from '../controllers/chatController.js';
// We might want to add protect middleware here if the community is only for logged-in users.
// For now, it's open, but let's assume it should be at least somewhat accessible.

const router = express.Router();

// GET /api/chat/history
router.get('/history', getChatHistory);

export default router;
