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