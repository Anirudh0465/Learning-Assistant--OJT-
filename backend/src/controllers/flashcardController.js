import Flashcard from '../models/FlashCards.js';
import Document from '../models/Document.js'
import { extractTextFromPDF } from '../utils/pdfParser.js';
import { generateAIFlashcards } from '../services/aiService.js';
import axios from "axios";
import fs from 'fs';

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

        const filePath = `temp-${Date.now()}.pdf`;
        try {
            fs.writeFileSync(filePath, response.data);
            const text = await extractTextFromPDF(filePath);
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
        } finally {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
    }catch(error){
        console.error(error);
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