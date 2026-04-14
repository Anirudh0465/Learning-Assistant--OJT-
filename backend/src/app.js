import express from "express";
import cors from "cors";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authroutes from "./routes/authRoutes.js";
import documentroutes from "./routes/documentRoutes.js";
import flashcardRoutes from './routes/flashcardRoutes.js';
import quizRoutes from "./routes/quizRoutes.js";
import { getDatabaseStatus } from "./config/db.js";

const app = express();

// Setup morgan logging to file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true });
}
const accessLogStream = fs.createWriteStream(path.join(logsDirectory, 'http.log'), { flags: 'a' });

app.use(cors({
  origin: true,
  credentials: true
}));


app.get("/", (req, res) => {
  res.status(200).json({
    message: "Backend is running",
    health: "/health"
  });
});

app.get("/health", (req, res) => {
  const db = getDatabaseStatus();
  const isHealthy = db.state === 'connected';

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'ok' : 'degraded',
    uptimeSeconds: Math.floor(process.uptime()),
    db
  });
});

app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));
app.use(express.json());

app.use("/api/auth", authroutes);
app.use('/api/documents', documentroutes);
app.use('/api/flashcards', flashcardRoutes);
app.use("/api/quizzes", quizRoutes);

export default app;
