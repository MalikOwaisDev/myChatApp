const mongoose = require('mongoose');
const Conversation = require('../../models/conversation.model');
const User = require('../../models/user.model');
const messageService = require('../../services/message.service');
const chatRequestService = require('../../services/chatRequest.service');
const { emitToUser } = require('../../utils/socketEmitter');

const createSocketRateLimit = (max = 30, windowMs = 60_000) => {
  let timestamps = [];
  return () => {
    const now = Date.now();
    timestamps = timestamps.filter((t) => now - t < windowMs);
    if (timestamps.length >= max) return false;
    timestamps.push(now);
    return true;
  };
};

const stripHtml = (str) =>
  str.replace(/<[^>]*>/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

const messageHandler = (io, socket) => {
  const checkRateLimit = createSocketRateLimit(30, 60_000);

  socket.on('send_message', async ({ conversationId, text }) => {
    try {
      if (!checkRateLimit()) {
        socket.emit('message_error', { error: 'Rate limit exceeded. Please slow down.' });
        return;
      }

      if (!conversationId || !text || !text.trim()) {
        socket.emit('message_error', { error: 'Invalid message data' });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(conversationId)) {
        socket.emit('message_error', { error: 'Invalid conversation ID' });
        return;
      }

      const sanitized = stripHtml(text).trim();

      if (!sanitized) {
        socket.emit('message_error', { error: 'Message text is required' });
        return;
      }

      if (sanitized.length > 2000) {
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

      const [senderData, otherData] = await Promise.all([
        User.findById(socket.userId, 'name username profileImage blockedUsers').lean(),
        User.findById(otherId, 'blockedUsers').lean(),
      ]);

      const isBlocked =
        senderData?.blockedUsers?.some((id) => String(id) === otherId) ||
        otherData?.blockedUsers?.some((id) => String(id) === socket.userId);

      if (isBlocked) {
        socket.emit('message_error', { error: 'Cannot message this user' });
        return;
      }

      const requestCheck = await chatRequestService.checkAndEnforce(
        conversationId,
        socket.userId,
        otherId
      );
      if (!requestCheck.allowed) {
        socket.emit('message_error', { error: requestCheck.error });
        return;
      }

      // Notify recipient in real-time when a brand-new chat request is created
      if (requestCheck.newRequest) {
        emitToUser(otherId, 'new_chat_request', {
          _id: requestCheck.newRequest._id,
          from: {
            _id: socket.userId,
            name: senderData?.name || 'Someone',
            username: senderData?.username || '',
            profileImage: senderData?.profileImage || null,
          },
          conversationId: { _id: String(conversationId) },
          status: 'pending',
          createdAt: requestCheck.newRequest.createdAt,
        });
      }

      const message = await messageService.createMessage(conversationId, socket.userId, sanitized);

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
