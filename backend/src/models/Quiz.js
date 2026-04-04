import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctAnswer: String
});

const quizSchema = new mongoose.Schema({
  title: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pdf: { type: mongoose.Schema.Types.ObjectId, ref: "Pdf" },
  document: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
  source: { type: String, default: "pdf" },
  questions: [questionSchema]
}, { timestamps: true });

export default mongoose.model("Quiz", quizSchema);