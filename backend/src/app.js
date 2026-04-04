import express from "express";
import cors from "cors";
import morgan from "morgan";
import authroutes from "./routes/authRoutes.js";
import documentroutes from "./routes/documentRoutes.js";
import flashcardRoutes from './routes/flashcardRoutes.js';
import quizRoutes from "./routes/quizRoutes.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());

app.use("/api/auth", authroutes);
app.use('/api/documents', documentroutes);
app.use('/api/flashcards', flashcardRoutes);
app.use("/api/quizzes", quizRoutes);

export default app;
