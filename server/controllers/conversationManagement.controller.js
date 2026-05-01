const asyncHandler = require('../utils/asyncHandler');
const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');

const muteConversation = asyncHandler(async (req, res) => {
  await Conversation.findByIdAndUpdate(req.conversation._id, {
    $addToSet: { mutedBy: req.user.id },
  });
  res.json({ muted: true });
});

const unmuteConversation = asyncHandler(async (req, res) => {
  await Conversation.findByIdAndUpdate(req.conversation._id, {
    $pull: { mutedBy: req.user.id },
  });
  res.json({ muted: false });
});

const deleteConversation = asyncHandler(async (req, res) => {
  await Conversation.findByIdAndUpdate(req.conversation._id, {
    $addToSet: { deletedFor: req.user.id },
  });
  res.json({ deleted: true });
});

const clearMessages = asyncHandler(async (req, res) => {
  await Message.updateMany(
    { conversationId: req.conversation._id },
    { $addToSet: { deletedFor: req.user.id } }
  );
  res.json({ cleared: true });
});

module.exports = { muteConversation, unmuteConversation, deleteConversation, clearMessages };
