import Message from './models/Message.js';

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected to community chat: ${socket.id}`);

    socket.on('sendMessage', async (data) => {
      try {
        const { senderId, content } = data;

        if (!senderId || !content) {
          return socket.emit('error', { message: 'senderId and content are required' });
        }

        const newMessage = new Message({
          sender: senderId,
          content: content,
        });
        await newMessage.save();

        await newMessage.populate('sender', 'username email profilePicture');
        
        const populatedMessage = newMessage.toJSON();

        socket.broadcast.emit('receiveMessage', populatedMessage);
        
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
