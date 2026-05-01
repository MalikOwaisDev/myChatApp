const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');

const createMediaMessage = async (conversationId, senderId, media, mediaType) => {
  const message = await Message.create({
    conversationId,
    senderId,
    media,
    mediaType,
    messageType: 'media',
  });

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: message._id,
    updatedAt: new Date(),
  });

  return message;
};

module.exports = { createMediaMessage };
