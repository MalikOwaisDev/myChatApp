const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');

const createMessage = async (conversationId, senderId, text) => {
  const message = await Message.create({ conversationId, senderId, text });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: message._id,
    updatedAt: new Date(),
  });

  return message;
};

const getMessages = async (conversationId, userId, page = 1, limit = 30) => {
  const skip = (page - 1) * limit;

  const messages = await Message.find({
    conversationId,
    deletedFor: { $nin: [userId] },
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return messages.reverse();
};

module.exports = { createMessage, getMessages };
