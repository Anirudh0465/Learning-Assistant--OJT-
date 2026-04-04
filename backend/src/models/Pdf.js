import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  fileUrl: String,
  extractedText: String
}, { timestamps: true });

export default mongoose.model("Pdf", pdfSchema);