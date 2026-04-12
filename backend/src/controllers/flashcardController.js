import Flashcard from '../models/FlashCards.js';
import Document from '../models/Document.js'
import { extractTextFromBuffer } from '../utils/pdfParser.js';
import { generateAIFlashcards } from '../services/aiService.js';
import { errorLogger } from '../utils/logger.js';
import axios from "axios";

export const createFlashcards = async (req,res) => {
    try{
        const { documentId }= req.params;
        const userId = req.user.id;

        const document = await Document.findById(documentId);
        if (!document){
            return res.status(404).json({ message: "Document not found" });
        }

        const response = await axios({
            url:document.fileUrl,
            method: "GET",
            responseType: "arraybuffer"
        });

        const pdfBuffer = Buffer.from(response.data);
        const text = await extractTextFromBuffer(pdfBuffer);
        const { summary, flashcards } = await generateAIFlashcards(text);

        await Flashcard.deleteMany({ user: userId, document: documentId });

        const savedCards = await Flashcard.insertMany(
            flashcards.map(card=>({
                ...card,
                user: userId,
                document: documentId
            }))
        );
        res.status(201).json({ summary, flashcards: savedCards });

    }catch(error){
        errorLogger.error("Flashcard generation failed: " + error);
        res.status(500).json({ message: "Flashcard generation failed"});
    }
};

export const getFlashcards = async (req,res) => {
    try{
        const cards = await Flashcard.find({user: req.user.id});
        res.json(cards);
    }catch(err){
        res.status(500).json({message:"Failed to fetch flashcards"});
    }
   
};