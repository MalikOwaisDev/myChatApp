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

      const otherId = String(conversation.participants.find((p) => String(p) !== socket.userId));

      // Block check: sender blocked other, or other blocked sender
      const [senderData, otherData] = await Promise.all([
        User.findById(socket.userId, 'name blockedUsers').lean(),
        User.findById(otherId, 'blockedUsers').lean(),
      ]);

      const isBlocked =
        senderData?.blockedUsers?.some((id) => String(id) === otherId) ||
        otherData?.blockedUsers?.some((id) => String(id) === socket.userId);

      if (isBlocked) {
        socket.emit('message_error', { error: 'Cannot message this user' });
        return;
      }

      const message = await messageService.createMessage(conversationId, socket.userId, text.trim());

      const payload = {
        _id: message._id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        senderName: senderData?.name || 'Someone',
        text: message.text,
        messageType: message.messageType,
        status: message.status,
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
