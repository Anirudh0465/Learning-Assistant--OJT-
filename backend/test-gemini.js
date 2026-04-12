import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyA5YgajS0TuZjS7VbrrksR0O97nOICddic");

const testModels = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite-001",
  "gemini-flash-lite-latest",
  "gemini-3.1-flash-live-preview"
];

async function findWorkingModel() {
  for (const modelName of testModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello!");
      console.log(`✅ Success with model: ${modelName}`);
      console.log(await result.response.text());
      return; // Stop on first success
    } catch (err) {
      console.log(`❌ Failed with model: ${modelName} - ${err.message}`);
    }
  }
}

findWorkingModel();
