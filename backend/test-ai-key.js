import 'dotenv/config.js';
import { generateAIFlashcards } from './src/services/aiService.js';

async function testAI() {
  try {
     console.log("Testing Gemini API Key:", process.env.GEMINI_API_KEY.slice(0, 5) + "...");
     const dummyText = "React is a JavaScript library for building user interfaces. It uses a virtual DOM to optimize rendering.";
     const result = await generateAIFlashcards(dummyText);
     console.log("SUCCESS! Result:", JSON.stringify(result, null, 2));
  } catch (error) {
     console.error("AI GENERATION ERROR:", error.message);
  }
}
testAI();
