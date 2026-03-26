import express from "express";
import {login, signup, updateProfile, changePassword} from "../controllers/authController.js";
import {protect} from "../middleware/authMiddleware.js";

const router = express.Router();
router.post('/login', login);
router.post('/signup',signup);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

export default router;