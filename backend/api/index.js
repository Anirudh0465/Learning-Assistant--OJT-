import connectDB from '../src/config/db.js';
import app from '../src/app.js';

// Connect to MongoDB upon serverless function cold start
connectDB();

// Export the Express app so Vercel can handle the routing
export default app;
