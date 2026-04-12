import Quiz from "../models/Quiz.js";
import Attempt from "../models/Attempt.js";
import Pdf from "../models/Pdf.js";
import Document from "../models/Document.js";
import { generateAIQuiz } from "../services/aiService.js";
import { extractTextFromBuffer } from "../utils/pdfParser.js";
import { errorLogger } from "../utils/logger.js";
import axios from "axios";

// Generate quiz from a Pdf record (legacy)
export const generateQuizFromPdf = async (req, res) => {
  try {
    const pdf = await Pdf.findOne({ _id: req.params.id, user: req.user.id });

    if (!pdf) {
      return res.status(404).json({ message: "PDF not found" });
    }

    const numQuestions = Math.floor(Math.random() * 11) + 30;
    const questions = await generateAIQuiz(pdf.extractedText, numQuestions);

    const quiz = await Quiz.create({
      title: "AI Generated Quiz",
      user: req.user.id,
      pdf: pdf._id,
      questions
    });

    res.json(quiz);
  } catch (err) {
    errorLogger.error("Quiz generation from Pdf failed: " + err);
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

    const numQuestions = Math.floor(Math.random() * 11) + 30;
    const questions = await generateAIQuiz(text, numQuestions);

    let quiz = await Quiz.findOne({ document: document._id, user: req.user.id });
    if (quiz) {
      quiz.questions.push(...questions);
      await quiz.save();
    } else {
      quiz = await Quiz.create({
        title: document.originalName || "AI Generated Quiz",
        user: req.user.id,
        document: document._id,
        source: "document",
        questions
      });
    }

    res.json(quiz);
  } catch (err) {
    errorLogger.error("Quiz generation from Document failed: " + err);
    res.status(500).json({ message: "Quiz generation failed" });
  }
};

export const getMyQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ user: req.user.id }).select('title source document questions createdAt updatedAt');
    res.json(quizzes.map(quiz => ({
      _id: quiz._id,
      title: quiz.title,
      source: quiz.source,
      document: quiz.document,
      questionCount: quiz.questions.length,
      createdAt: quiz.createdAt,
      updatedAt: quiz.updatedAt
    })));
  } catch (err) {
    errorLogger.error('Get quizzes failed: ' + err);
    res.status(500).json({ message: 'Failed to fetch quizzes' });
  }
};

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user.id });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const safeQuiz = {
      _id: quiz._id,
      title: quiz.title,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }))
    };

    res.json(safeQuiz);
  } catch (err) {
    errorLogger.error("Get quiz failed: " + err);
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
};

export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Answers must be provided as a non-empty array" });
    }

    const quiz = await Quiz.findOne({ _id: req.params.id, user: req.user.id });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    if (!quiz.questions || quiz.questions.length === 0) {
      return res.status(400).json({ message: "Quiz has no questions" });
    }

    let score = 0;

    const evaluated = quiz.questions.map((q, i) => {
      const selected = answers[i] ?? null;
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
    errorLogger.error("Submit quiz failed: " + err);
    res.status(500).json({ message: "Failed to submit quiz" });
  }
};
