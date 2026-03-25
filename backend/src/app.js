import express from "express";
import cors from "cors";
import authroutes from "./routes/authRoutes.js";
import documentroutes from "./routes/documentRoutes.js";
import flashcardRoutes from './routes/flashcardRoutes.js';
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authroutes);
app.use('/api/documents', documentroutes);
app.use('/api/flashcards',flashcardRoutes);

export default app;