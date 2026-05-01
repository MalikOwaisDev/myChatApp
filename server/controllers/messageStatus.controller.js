const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const Conversation = require('../models/conversation.model');
const messageStatusService = require('../services/messageStatus.service');
const { emitToUser } = require('../utils/socketEmitter');

const validateAccess = async (conversationId, userId) => {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) return null;
  const conversation = await Conversation.findById(conversationId, 'participants').lean();
  if (!conversation) return null;
  const isMember = conversation.participants.some((p) => String(p) === String(userId));
  return isMember ? conversation : null;
};

const markMessagesDelivered = asyncHandler(async (req, res) => {
  const { conversationId } = req.body;
  const conversation = await validateAccess(conversationId, req.user.id);
  if (!conversation) {
    return res.status(400).json({ message: 'Invalid or inaccessible conversation' });
  }

  const bySender = await messageStatusService.markDelivered(conversationId, req.user.id);

  for (const [senderId, messageIds] of Object.entries(bySender)) {
    emitToUser(senderId, 'message_delivered', {
      conversationId: String(conversationId),
      messageIds,
    });
  }

  res.json({ updated: Object.values(bySender).flat().length });
});

const markMessagesSeen = asyncHandler(async (req, res) => {
  const { conversationId } = req.body;
  const conversation = await validateAccess(conversationId, req.user.id);
  if (!conversation) {
    return res.status(400).json({ message: 'Invalid or inaccessible conversation' });
  }

  const bySender = await messageStatusService.markSeen(conversationId, req.user.id);

  for (const [senderId, messageIds] of Object.entries(bySender)) {
    emitToUser(senderId, 'message_seen', {
      conversationId: String(conversationId),
      messageIds,
    });
  }

  res.json({ updated: Object.values(bySender).flat().length });
});

module.exports = { markMessagesDelivered, markMessagesSeen };
