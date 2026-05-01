const mongoose = require('mongoose');
const Conversation = require('../../models/conversation.model');
const User = require('../../models/user.model');
const messageService = require('../../services/message.service');
const { emitToUser } = require('../../utils/socketEmitter');

const messageHandler = (io, socket) => {
  socket.on('send_message', async ({ conversationId, text }) => {
    try {
      if (!conversationId || !text || !text.trim()) {
        socket.emit('message_error', { error: 'Invalid message data' });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        socket.emit('message_error', { error: 'Invalid conversation ID' });
        return;
      }

      if (text.trim().length > 2000) {
        socket.emit('message_error', { error: 'Message too long' });
        return;
      }

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        socket.emit('message_error', { error: 'Conversation not found' });
        return;
      }

      const isMember = conversation.participants.some(
        (p) => String(p) === socket.userId
      );
      if (!isMember) {
        socket.emit('message_error', { error: 'Access denied' });
        return;
      }

      const [message, sender] = await Promise.all([
        messageService.createMessage(conversationId, socket.userId, text.trim()),
        User.findById(socket.userId, 'name').lean(),
      ]);

      const payload = {
        _id: message._id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        senderName: sender?.name || 'Someone',
        text: message.text,
        messageType: message.messageType,
        createdAt: message.createdAt,
      };

      for (const participantId of conversation.participants) {
        emitToUser(String(participantId), 'receive_message', payload);
      }
    } catch {
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });
};

module.exports = messageHandler;
