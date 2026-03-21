import express from "express";
import cors from "cors";
import authroutes from "./routes/authRoutes.js";
import documentroutes from "./routes/documentRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authroutes);
app.use('/api/documents', documentroutes);

export default app;