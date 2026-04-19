import Message from './models/Message.js';

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected to community chat: ${socket.id}`);

    // Listen for new messages
    socket.on('sendMessage', async (data) => {
      try {
        const { senderId, content } = data;

        if (!senderId || !content) {
          return socket.emit('error', { message: 'senderId and content are required' });
        }

        // Save message to database
        const newMessage = new Message({
          sender: senderId,
          content: content,
        });
        await newMessage.save();

        // Populate sender details directly instead of querying the DB again
        await newMessage.populate('sender', 'username email profilePicture');
        
        // Convert to plain JS object before emitting
        const populatedMessage = newMessage.toJSON();

        // Broadcast to everyone else
        socket.broadcast.emit('receiveMessage', populatedMessage);
        
        // Also send back to the sender so they know it was successful
        socket.emit('receiveMessage', populatedMessage);

      } catch (error) {
        console.error('Socket sendMessage error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from community chat: ${socket.id}`);
    });
  });
};
