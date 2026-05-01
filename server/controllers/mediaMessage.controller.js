const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const Conversation = require('../models/conversation.model');
const User = require('../models/user.model');
const { createMediaMessage } = require('../services/mediaMessage.service');
const { emitToUser } = require('../utils/socketEmitter');

const sendMediaMessage = asyncHandler(async (req, res) => {
  const { conversationId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    return res.status(400).json({ message: 'Invalid conversation ID' });
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) return res.status(404).json({ message: 'Conversation not found' });

  const isMember = conversation.participants.some((p) => String(p) === String(req.user.id));
  if (!isMember) return res.status(403).json({ message: 'Access denied' });

  const [message, sender] = await Promise.all([
    createMediaMessage(conversationId, req.user.id, req.body.media, req.mediaType),
    User.findById(req.user.id, 'name').lean(),
  ]);

  const payload = {
    _id: message._id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    senderName: sender?.name || 'Someone',
    media: message.media,
    mediaType: message.mediaType,
    messageType: message.messageType,
    status: message.status,
    createdAt: message.createdAt,
  };

  for (const participantId of conversation.participants) {
    emitToUser(String(participantId), 'receive_message', payload);
  }

  res.status(201).json(payload);
});

module.exports = { sendMediaMessage };
