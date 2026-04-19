import Message from '../models/Message.js';

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
