import 'dotenv/config';
import connectDB, { getDatabaseStatus } from "./config/db.js";
import app from './app.js';
import { authLogger } from "./utils/logger.js";

const connectDBWithRetry = async () => {
  const connected = await connectDB();
  const retryDelayMs = Number(process.env.DB_RETRY_DELAY_MS) || 10000;

  if (!connected) {
    authLogger.warn(`Database unavailable. Retrying in ${retryDelayMs / 1000}s`);
    setTimeout(connectDBWithRetry, retryDelayMs);
  }
};

connectDBWithRetry();

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, '::', () => {
  const dbStatus = getDatabaseStatus();
  authLogger.info(`Server running on port ${PORT} (db: ${dbStatus.state})`);
  console.log(`Server running on port ${PORT}`);
});
