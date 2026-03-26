import 'dotenv/config.js';

import connectDB from "./config/db.js";
import app from './app.js';
import { authLogger } from "./utils/logger.js";

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  authLogger.info(`Server running on port ${PORT}`);
  console.log(`Server runnign on port ${PORT}`);
})