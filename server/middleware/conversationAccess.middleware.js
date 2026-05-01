const mongoose = require('mongoose');
const Conversation = require('../models/conversation.model');

const conversationAccess = async (req, res, next) => {
  const { id, conversationId } = req.params;
  const targetId = id || conversationId;

  if (!mongoose.Types.ObjectId.isValid(targetId)) {
    return res.status(400).json({ message: 'Invalid conversation ID' });
  }

  const conversation = await Conversation.findById(targetId);

  if (!conversation) {
    return res.status(404).json({ message: 'Conversation not found' });
  }

  const isMember = conversation.participants.some(
    (p) => String(p) === String(req.user.id)
  );

  if (!isMember) {
    return res.status(403).json({ message: 'Access denied' });
  }

  req.conversation = conversation;
  next();
};

module.exports = { conversationAccess };
