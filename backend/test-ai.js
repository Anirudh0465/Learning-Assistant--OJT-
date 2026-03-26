import 'dotenv/config.js';
import mongoose from 'mongoose';
import Document from './src/models/Document.js';
import { extractTextFromBuffer } from './src/utils/pdfParser.js';
import { generateAIFlashcards } from './src/services/aiService.js';
import axios from 'axios';
import fs from 'fs';

async function runTest() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("Fetching a document...");
    const doc = await Document.findOne();
    if (!doc) {
      console.log("No documents found in DB. Cannot test.");
      process.exit(0);
    }
    console.log("Testing with document:", doc.originalName, doc.fileUrl);

    console.log("Downloading PDF...");
    const response = await axios({
      url: doc.fileUrl,
      method: "GET",
      responseType: "arraybuffer"
    });

    console.log("Extracting text from PDF Buffer in Memory...");
    const pdfBuffer = Buffer.from(response.data);
    const text = await extractTextFromBuffer(pdfBuffer);
    console.log("Extracted text length:", text.length, text.substring(0, 100).replace(/\n/g, " "));

    console.log("Generating AI Flashcards...");
    const aiResult = await generateAIFlashcards(text);
    console.log("AI Result length (flashcards):", aiResult.flashcards.length);

    console.log("Success! Clean exiting.");
    process.exit(0);
  } catch (err) {
    console.error("DEBUG ERROR:", err);
    process.exit(1);
  }
}

runTest();
