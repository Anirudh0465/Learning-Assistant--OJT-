import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authroutes from "./routes/authRoutes.js";
import { authLogger, errorLogger } from "./utils/logger.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json()); 

app.use("/api/auth", authroutes);


//database tester(not really used now)
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;

    authLogger.info(`User creation attempt: ${email}`);

    const user = await test.create({ name, email });

    authLogger.info(`User created: ${user._id}`);

    res.status(201).json(user);

  } catch (error) {
    errorLogger.error(`User creation failed: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  authLogger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});