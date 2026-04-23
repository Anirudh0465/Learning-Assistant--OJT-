import Message from '../models/Message.js';
import Document from '../models/Document.js';
import axios from 'axios';
import { extractTextFromBuffer } from '../utils/pdfParser.js';
import { askDocumentQuestion } from '../services/aiService.js';
import { errorLogger } from '../utils/logger.js';

export const getChatHistory = async (req, res) => {
  try {
    // Fetch the last 50 messages, sorted by oldest first for correct display order
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'username email profilePicture') // Adjust fields based on User model
      .lean();

    // Reverse the array so the oldest is first, newest is last (standard chat flow)
    const formattedMessages = messages.reverse();

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

export const askAIQuestion = async (req, res) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({ error: 'documentId and question are required' });
    }

    const document = await Document.findOne({ _id: documentId, userId: req.user.id });

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Download PDF and extract text
    const response = await axios({ url: document.fileUrl, method: 'GET', responseType: 'arraybuffer' });
    const pdfBuffer = Buffer.from(response.data);
    const text = await extractTextFromBuffer(pdfBuffer);

    // Get answer from AI
    const aiResponse = await askDocumentQuestion(text, question);

    res.status(200).json(aiResponse);
  } catch (error) {
    errorLogger.error('Error in askAIQuestion: ' + error);
    res.status(500).json({ error: 'Failed to process AI question' });
  }
};
