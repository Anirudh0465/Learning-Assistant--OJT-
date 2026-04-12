import { GoogleGenerativeAI } from "@google/generative-ai";
import { aiLogger } from "../utils/logger.js";

const modelName = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const splitSentences = (text) => {
  return text
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
};

const safeTextSummary = (text) => {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return "No content available.";
  return sentences.slice(0, 2).join(' ').slice(0, 300);
};

const generateFallbackFlashcards = (text) => {
  const sentences = splitSentences(text);
  const summary = safeTextSummary(text);
  const cards = sentences.slice(0, 10).map((sentence, index) => ({
    question: `What is the key idea in sentence ${index + 1}?`,
    answer: sentence
  }));
  return {
    summary: summary || "Fallback flashcards generated from text.",
    flashcards: cards.length ? cards : [
      { question: "What is the main topic?", answer: "The document contains study material." }
    ]
  };
};

const generateFallbackQuiz = (text, numQuestions = 5) => {
  const sentences = splitSentences(text);
  const questions = [];
  const source = sentences.length >= numQuestions ? sentences : sentences.concat(Array(numQuestions - sentences.length).fill('Review the document content.'));

  for (let i = 0; i < numQuestions; i++) {
    const correct = source[i] || 'Review the document content.';
    const distractors = source
      .filter((_, idx) => idx !== i)
      .slice(0, 3)
      .map((s) => s.substring(0, 80));

    const options = [correct, ...distractors].slice(0, 4);
    while (options.length < 4) {
      options.push('No additional option available');
    }

    questions.push({
      question: `Which of the following summaries best matches the content of the document?`,
      options,
      correctAnswer: correct
    });
  }

  return questions;
};

const parseJson = (response, expectedType) => {
  const cleaned = response.replace(/```json\n?/ig, '').replace(/```\n?/g, '').trim();
  const parsed = JSON.parse(cleaned);
  if (expectedType === 'quiz') {
    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error('Invalid quiz structure from AI');
    }
    return parsed;
  }
  if (expectedType === 'flashcards') {
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.flashcards)) {
      throw new Error('Invalid flashcards structure from AI');
    }
    return parsed;
  }
  return parsed;
};

const useAI = () => !!genAI;

export const generateAIQuiz = async (text, numQuestions = 5) => {
  if (!useAI()) {
    return generateFallbackQuiz(text, numQuestions);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
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
    return parseJson(response, 'quiz');
  } catch (apiError) {
    aiLogger.error("Gemini Quiz API Error: " + apiError);
    return generateFallbackQuiz(text, numQuestions);
  }
};

export const generateAIFlashcards = async (text) => {
  if (!useAI()) {
    return generateFallbackFlashcards(text);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
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
    return parseJson(response, 'flashcards');
  } catch (apiError) {
    aiLogger.error("Gemini Flashcards API Error: " + apiError);
    return generateFallbackFlashcards(text);
  }
};
