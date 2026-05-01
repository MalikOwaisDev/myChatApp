const mongoose = require('mongoose');
const Conversation = require('../../models/conversation.model');
const messageStatusService = require('../../services/messageStatus.service');
const { emitToUser } = require('../../utils/socketEmitter');

const messageStatusHandler = (io, socket) => {
  // mark_delivered: emitted by recipient when they receive a message
  socket.on('mark_delivered', async ({ conversationId }) => {
    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) return;
    try {
      const conversation = await Conversation.findById(conversationId, 'participants').lean();
      if (!conversation) return;
      const isMember = conversation.participants.some((p) => String(p) === socket.userId);
      if (!isMember) return;

      const bySender = await messageStatusService.markDelivered(conversationId, socket.userId);
      for (const [senderId, messageIds] of Object.entries(bySender)) {
        emitToUser(senderId, 'message_delivered', {
          conversationId: String(conversationId),
          messageIds,
        });
      }
    } catch {}
  });
};

module.exports = messageStatusHandler;
