import { GoogleGenerativeAI } from "@google/generative-ai";
import { aiLogger } from "../utils/logger.js";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAIQuiz = async (text, numQuestions = 5) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  const prompt = `You are an expert educator and quiz creator.
    Analyze the following text from a student's PDF document and create a high-quality multiple-choice quiz.

    Instructions:
    1. Create exactly ${numQuestions} multiple-choice questions based on the key concepts in the text.
    2. Each question must have exactly 4 answer options.
    3. The options must be the actual answer text (not labeled A/B/C/D).
    4. Ensure only ONE option is the correct answer.
    5. The correctAnswer value MUST exactly match one of the strings in the options array.

    Return ONLY valid JSON in this exact format, with no other text or explanation:
    [
      {
        "question": "...",
        "options": ["option1", "option2", "option3", "option4"],
        "correctAnswer": "the exact text of the correct option"
      }
    ]

    Text:
    ${text.slice(0, 15000)}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    try {
      const cleaned = response.replace(/```json\n?/ig, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (parseError) {
      aiLogger.error("Gemini Quiz JSON Parse Error: " + parseError + "\nRaw: " + response);
      throw new Error("AI returned invalid JSON for quiz");
    }
  } catch (apiError) {
    aiLogger.error("Gemini Quiz API Error: " + apiError);
    throw new Error("Failed to generate quiz from AI: " + apiError.message);
  }
};

export const generateAIFlashcards = async (text) => {
const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"});
    const prompt = `You are an expert AI tutor and study guide creator.
    Analyze the following text from a student's PDF document and extract the most important information into a set of high-quality Flashcards.
    
    Instructions:
    1. Read the text carefully and extract the core concepts, definitions, and key facts.
    2. Create highly detailed Question and Answer pairs based purely on the factual information in the text.
    3. Generate AT LEAST 10-15 flashcards, expanding on sub-topics to ensure an adequate quantity.
    4. Make the answers appropriate for a Flashcard format: They MUST be highly accurate, strictly derived from the text, and concise (1-3 sentences maximum). Avoid overly long paragraphs.
    5. CRITICAL: The "answer" MUST contain the actual factual explanation, definition, or data from the text. DO NOT simply restate or reverse the question! Give the true, informative answer.
    
    Return ONLY valid JSON in this exact format, with no other text or explanation:
    {
        "summary": "A 2-sentence summary of the document's main topic",
        "flashcards": [
            {"question": "...", "answer": "..."},
            {"question": "...", "answer": "..."},
            {"question": "...", "answer": "..."}
        ]
    }
    Text:
    ${text.slice(0, 15000)}`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response.text();

        try {
            const cleaned = response.replace(/```json\n?/ig, '').replace(/```\n?/g, '').trim();
            return JSON.parse(cleaned);
        } catch (parseError) {
            aiLogger.error("Gemini JSON Parse Error: " + parseError + "\nRaw AI Response: " + response);
            return {
                summary: "AI generated invalid data.",
                flashcards: [
                    { question: "Why did this happen?", answer: "The AI did not output valid JSON format." },
                    { question: "What should I do?", answer: "Try generating flashcards again." }
                ]
            };
        }
    } catch (apiError) {
        aiLogger.error("Gemini API Request Error: " + apiError);
        return {
            summary: "AI analysis failed due to server error.",
            flashcards: [
                { question: "Why did flashcard generation fail?", answer: apiError.message },
                { question: "What should I do now?", answer: "Try again later or check API limits." }
            ]
        };
    }
};
