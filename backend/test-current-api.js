import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";

console.log('\n🧪 Testing Gemini API Configuration\n');
console.log('=====================================\n');

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

console.log(`API Key: ${apiKey ? apiKey.substring(0, 15) + '...' : 'NOT SET'}`);
console.log(`Model: ${modelName}\n`);

if (!apiKey) {
  console.log('❌ GEMINI_API_KEY is not set!\n');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function testAPI() {
  try {
    console.log(`🔄 Testing model: ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const result = await model.generateContent("Say hello in one sentence.");
    const response = await result.response;
    const text = response.text();
    
    console.log(`✅ SUCCESS! Model ${modelName} is working!\n`);
    console.log(`Response: ${text}\n`);
    
    // Test with a quiz-like prompt
    console.log('🔄 Testing quiz generation format...');
    const quizResult = await model.generateContent(`Create 1 simple quiz question in JSON format:
    {
      "question": "What is 2+2?",
      "options": ["3", "4", "5", "6"],
      "correctAnswer": "4"
    }`);
    
    const quizResponse = await quizResult.response;
    const quizText = quizResponse.text();
    
    console.log(`✅ Quiz format test successful!\n`);
    console.log(`Response: ${quizText.substring(0, 200)}...\n`);
    
    console.log('✅ All tests passed! Gemini API is working correctly.\n');
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}\n`);
    
    if (error.message.includes('429')) {
      console.log('⚠️  QUOTA EXCEEDED - Your API key has hit the rate limit.');
      console.log('   Solutions:');
      console.log('   1. Wait for quota to reset (per minute/day)');
      console.log('   2. Use a different API key');
      console.log('   3. Upgrade to paid plan\n');
    } else if (error.message.includes('404')) {
      console.log('⚠️  MODEL NOT FOUND - The model name might be incorrect.');
      console.log(`   Current model: ${modelName}`);
      console.log('   Try: gemini-2.5-flash-lite or gemini-1.5-flash\n');
    } else if (error.message.includes('401') || error.message.includes('403')) {
      console.log('⚠️  AUTHENTICATION ERROR - API key might be invalid.\n');
    }
    
    process.exit(1);
  }
}

testAPI();
