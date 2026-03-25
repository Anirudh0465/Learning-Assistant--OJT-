import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateAIFlashcards = async (text) => {
const model = genAI.getGenerativeModel({model: "gemini-1.5-flash-latest"});
    const prompt = `You are a helpful teacher.
    From the following text:
    1. Give a simple explanation 
    2. Generate the reqiured flashcards explaining the pdf material
    
    Return ONLY JSON in this format:
    {
        "summary": "....",
        "flashcards": [
            {"question": "...", "answer": "..."}
        ]
    }
    Text:
    ${text.slice(0,3000)};`
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    // Strip markdown code fences Gemini sometimes wraps JSON in
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
}
