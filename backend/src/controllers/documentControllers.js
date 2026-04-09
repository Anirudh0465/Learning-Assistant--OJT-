import cloudinary  from "../config/cloudinary.js";
import Document  from "../models/Document.js";

export const uploadDocument = async (req,res) => {
    try{
        const file = req.file;
        const result = await cloudinary.uploader.upload_stream(
            { resource_type: "raw" },
            async (error,uploaded) => {
                if (error){
                    return res.status(500).json(error);
                }
                const doc = await Document.create({
                    userId: req.user.id,
                    fileUrl: uploaded.secure_url,
                    originalName: file.originalname,
                });
                res.json(doc);
            }
        );
        result.end(file.buffer);
    }catch(err){
        res.status(500).json({message: err.message});
    }
};

export const getDocuments = async (req, res) => {
    try {
        const docs = await Document.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(docs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const doc = await Document.findOneAndDelete({ _id: id, userId });
        if (!doc) {
            return res.status(404).json({ message: "Document not found or unauthorized to delete" });
        }

        // Cascade delete associated Flashcards
        await import("../models/FlashCards.js").then(async ({ default: Flashcard }) => {
             await Flashcard.deleteMany({ document: id });
        });

        // Cascade delete associated Quizzes
        await import("../models/Quiz.js").then(async ({ default: Quiz }) => {
             await Quiz.deleteMany({ document: id });
        });

        res.json({ message: "Document and its associated quizzes/flashcards deleted successfully", id });
    } catch (err) {
        console.error("Delete document failed:", err);
        res.status(500).json({ message: "Failed to delete document" });
    }
};