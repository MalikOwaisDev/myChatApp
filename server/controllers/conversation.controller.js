const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const Conversation = require('../models/conversation.model');
const User = require('../models/user.model');

const createOrGetConversation = asyncHandler(async (req, res) => {
  const { participantId } = req.body;

  if (!participantId) {
    return res.status(400).json({ message: 'participantId is required' });
  }

  if (!mongoose.Types.ObjectId.isValid(participantId)) {
    return res.status(400).json({ message: 'Invalid participant ID' });
  }

  if (String(participantId) === String(req.user.id)) {
    return res.status(400).json({ message: 'Cannot start a conversation with yourself' });
  }

  const participant = await User.findById(participantId);
  if (!participant) {
    return res.status(404).json({ message: 'User not found' });
  }

  const existing = await Conversation.findOne({
    participants: { $all: [req.user.id, participantId], $size: 2 },
  }).populate('participants', 'name username profileImage')
    .populate({ path: 'lastMessage', select: 'text messageType senderId createdAt' });

  if (existing) {
    return res.json(existing);
  }

  const conversation = await Conversation.create({
    participants: [req.user.id, participantId],
  });

  const populated = await Conversation.findById(conversation._id)
    .populate('participants', 'name username profileImage')
    .populate({ path: 'lastMessage', select: 'text messageType senderId createdAt' });

  res.status(201).json(populated);
});

const getUserConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user.id,
  })
    .sort({ updatedAt: -1 })
    .populate('participants', 'name username profileImage')
    .populate({ path: 'lastMessage', select: 'text messageType senderId createdAt' });

  res.json(conversations);
});

const getConversationById = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.conversation._id)
    .populate('participants', 'name username profileImage')
    .populate({ path: 'lastMessage', select: 'text messageType senderId createdAt' });

  res.json(conversation);
});

module.exports = { createOrGetConversation, getUserConversations, getConversationById };
