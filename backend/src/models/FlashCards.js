import mongoose from "mongoose";
const flashcardSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    document:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Document"
    },
    question: String,
    answer: String
}, {timestamps: true});

export default mongoose.model("Flashcard", flashcardSchema)