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


module.exports = { createMessage };
