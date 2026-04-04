import 'dotenv/config.js';
import { generateAIQuiz } from './src/services/aiService.js';

async function testQuizGeneration() {
  try {
    console.log("Testing quiz generation...");
    const dummyText = "React is a JavaScript library for building user interfaces. It allows developers to create reusable UI components. Components can be functional or class-based. State management is crucial in React applications. Hooks like useState and useEffect help manage state and side effects.";
    const quiz = await generateAIQuiz(dummyText, 3);
    console.log("Generated Quiz:", JSON.stringify(quiz, null, 2));
    console.log("Success! Quiz generation is working.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

testQuizGeneration();