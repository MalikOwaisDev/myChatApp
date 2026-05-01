const Conversation = require('../models/conversation.model');
const { isOnline, getAllOnlineUserIds } = require('../utils/socketEmitter');

const getConversationPartners = async (userId) => {
  const conversations = await Conversation.find(
    { participants: userId },
    'participants'
  ).lean();

  const partnerIds = new Set();
  for (const conv of conversations) {
    for (const p of conv.participants) {
      if (String(p) !== String(userId)) partnerIds.add(String(p));
    }
  }
  return Array.from(partnerIds);
};

module.exports = { getConversationPartners, isOnline, getAllOnlineUserIds };
