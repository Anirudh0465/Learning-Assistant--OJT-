import mongoose from "mongoose";

const attemptSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz" },
  answers: [
    {
      questionId: String,
      selected: String,
      correct: String
    }
  ],
  score: Number
}, { timestamps: true });

export default mongoose.model("Attempt", attemptSchema);