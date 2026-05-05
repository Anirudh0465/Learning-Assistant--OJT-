import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateAIQuiz, generateAIFlashcards, askDocumentQuestion } from './src/services/aiService.js';

console.log('\n🔍 Gemini API Diagnostic Tool\n');
console.log('===============================\n');

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

// Step 1: Check environment variables
console.log('📋 Step 1: Environment Variables');
console.log(`   API Key: ${apiKey ? '✅ Set (' + apiKey.substring(0, 15) + '...)' : '❌ NOT SET'}`);
console.log(`   Model: ${modelName}`);
console.log('');

if (!apiKey) {
  console.log('❌ GEMINI_API_KEY is not set! Please add it to your .env file.\n');
  process.exit(1);
}

// Step 2: Test direct API connection
async function testDirectAPI() {
  console.log('🔄 Step 2: Testing Direct API Connection');
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const result = await model.generateContent("Respond with just 'OK' if you can read this.");
    const response = await result.response;
    const text = response.text();
    
    console.log(`   ✅ Direct API connection successful`);
    console.log(`   Response: ${text.trim()}`);
    console.log('');
    return true;
  } catch (error) {
    console.log(`   ❌ Direct API connection failed`);
    console.log(`   Error: ${error.message}`);
    console.log('');
    return false;
  }
}

// Step 3: Test quiz generation
async function testQuizGeneration() {
  console.log('🔄 Step 3: Testing Quiz Generation');
  try {
    const sampleText = `
      JavaScript is a programming language that is one of the core technologies of the World Wide Web.
      It is a high-level, often just-in-time compiled language that conforms to the ECMAScript standard.
      JavaScript has dynamic typing, prototype-based object-orientation, and first-class functions.
    `;
    
    const quiz = await generateAIQuiz(sampleText, 2);
    
    if (Array.isArray(quiz) && quiz.length > 0) {
      console.log(`   ✅ Quiz generation successful`);
      console.log(`   Generated ${quiz.length} questions`);
      console.log(`   Sample question: ${quiz[0].question.substring(0, 60)}...`);
      console.log('');
      return true;
    } else {
      console.log(`   ⚠️  Quiz generated but format unexpected`);
      console.log(`   Result: ${JSON.stringify(quiz).substring(0, 100)}...`);
      console.log('');
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Quiz generation failed`);
    console.log(`   Error: ${error.message}`);
    console.log('');
    return false;
  }
}

// Step 4: Test flashcard generation
async function testFlashcardGeneration() {
  console.log('🔄 Step 4: Testing Flashcard Generation');
  try {
    const sampleText = `
      React is a free and open-source front-end JavaScript library for building user interfaces.
      It is maintained by Meta and a community of individual developers and companies.
      React can be used to develop single-page, mobile, or server-rendered applications.
    `;
    
    const flashcards = await generateAIFlashcards(sampleText);
    
    if (flashcards && flashcards.flashcards && Array.isArray(flashcards.flashcards)) {
      console.log(`   ✅ Flashcard generation successful`);
      console.log(`   Generated ${flashcards.flashcards.length} flashcards`);
      console.log(`   Summary: ${flashcards.summary.substring(0, 60)}...`);
      console.log('');
      return true;
    } else {
      console.log(`   ⚠️  Flashcards generated but format unexpected`);
      console.log(`   Result: ${JSON.stringify(flashcards).substring(0, 100)}...`);
      console.log('');
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Flashcard generation failed`);
    console.log(`   Error: ${error.message}`);
    console.log('');
    return false;
  }
}

// Step 5: Test document Q&A
async function testDocumentQA() {
  console.log('🔄 Step 5: Testing Document Q&A');
  try {
    const sampleText = `
      Node.js is a cross-platform, open-source JavaScript runtime environment.
      It runs on the V8 JavaScript engine and executes JavaScript code outside a web browser.
      Node.js lets developers use JavaScript to write command line tools and server-side scripts.
    `;
    
    const result = await askDocumentQuestion(sampleText, "What is Node.js?");
    
    if (result && result.answer) {
      console.log(`   ✅ Document Q&A successful`);
      console.log(`   Answer: ${result.answer.substring(0, 80)}...`);
      console.log('');
      return true;
    } else {
      console.log(`   ⚠️  Q&A generated but format unexpected`);
      console.log(`   Result: ${JSON.stringify(result).substring(0, 100)}...`);
      console.log('');
      return false;
    }
  } catch (error) {
    console.log(`   ❌ Document Q&A failed`);
    console.log(`   Error: ${error.message}`);
    console.log('');
    return false;
  }
}

// Run all tests
async function runDiagnostics() {
  const results = {
    directAPI: await testDirectAPI(),
    quiz: await testQuizGeneration(),
    flashcards: await testFlashcardGeneration(),
    qa: await testDocumentQA()
  };
  
  console.log('===============================');
  console.log('📊 Diagnostic Summary\n');
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  console.log(`   Direct API: ${results.directAPI ? '✅' : '❌'}`);
  console.log(`   Quiz Generation: ${results.quiz ? '✅' : '❌'}`);
  console.log(`   Flashcard Generation: ${results.flashcards ? '✅' : '❌'}`);
  console.log(`   Document Q&A: ${results.qa ? '✅' : '❌'}`);
  console.log('');
  console.log(`   Total: ${passed}/${total} tests passed`);
  console.log('');
  
  if (passed === total) {
    console.log('✅ All systems operational! Gemini API is working perfectly.\n');
  } else if (passed > 0) {
    console.log('⚠️  Some features are working, but there are issues with others.\n');
    console.log('   Possible causes:');
    console.log('   - API quota limits for specific operations');
    console.log('   - Network connectivity issues');
    console.log('   - Model compatibility issues\n');
  } else {
    console.log('❌ All tests failed. Please check:');
    console.log('   1. API key is valid');
    console.log('   2. API key has available quota');
    console.log('   3. Network connection is stable');
    console.log('   4. Model name is correct\n');
  }
}

runDiagnostics().catch(error => {
  console.log(`\n❌ Diagnostic tool crashed: ${error.message}\n`);
  process.exit(1);
});
