import Quiz from "../models/Quiz.js";
import Attempt from "../models/Attempt.js";
import Pdf from "../models/Pdf.js";
import Document from "../models/Document.js";
import { generateAIQuiz } from "../services/aiService.js";
// Generate quiz from a Pdf record (legacy)
export const generateQuizFromPdf = async (req, res) => {
  try {
    const pdf = await Pdf.findOne({ _id: req.params.id, user: req.user.id });

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    const questions = await generateAIQuiz(pdf.extractedText, 5);

    const quiz = await Quiz.create({
      title: "AI Generated Quiz",
      user: req.user.id,
      pdf: pdf._id,
      questions
    });

    res.json(quiz);
  } catch (err) {
    console.error("Quiz generation from Pdf failed:", err);
    res.status(500).json({ message: "Quiz generation failed" });
  }
};

// Generate quiz from an uploaded Document (downloads PDF, extracts text)
export const generateQuizFromDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ _id: req.params.id, userId: req.user.id });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    const response = await axios({ url: document.fileUrl, method: "GET", responseType: "arraybuffer" });
    const pdfBuffer = Buffer.from(response.data);
    const text = await extractTextFromBuffer(pdfBuffer);

    const questions = await generateAIQuiz(text, 5);

    const quiz = await Quiz.create({
      title: document.originalName || "AI Generated Quiz",
      user: req.user.id,
      document: document._id,
      source: "document",
      questions
    });

    res.json(quiz);
  } catch (err) {
    console.error("Quiz generation from Document failed:", err);
    res.status(500).json({ message: "Quiz generation failed" });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const safeQuiz = {
      _id: quiz._id,
      title: quiz.title,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options
      }))
    };

    res.json(safeQuiz);
  } catch (err) {
    console.error("Get quiz failed:", err);
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;

    const evaluated = quiz.questions.map((q, i) => {
      const selected = answers[i];
      if (selected === q.correctAnswer) score++;
      return { questionId: q._id, selected, correct: q.correctAnswer };
    });

    await Attempt.create({
      user: req.user.id,
      quiz: quiz._id,
      answers: evaluated,
      score
    });

    res.json({ score, total: quiz.questions.length });
  } catch (err) {
    console.error("Submit quiz failed:", err);
    res.status(500).json({ message: "Failed to submit quiz" });
  }
};
