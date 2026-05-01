const Message = require('../models/message.model');

/**
 * Marks 'sent' messages in a conversation as 'delivered'.
 * Only updates messages NOT sent by userId (the recipient calling this).
 * Returns a map of { [senderId]: [messageId, ...] } for socket emission.
 */
const markDelivered = async (conversationId, userId) => {
  const messages = await Message.find(
    { conversationId, senderId: { $ne: userId }, status: 'sent' },
    '_id senderId'
  ).lean();

  if (!messages.length) return {};

  const ids = messages.map((m) => m._id);
  await Message.updateMany({ _id: { $in: ids } }, { $set: { status: 'delivered' } });

  const bySender = {};
  for (const m of messages) {
    const sid = String(m.senderId);
    if (!bySender[sid]) bySender[sid] = [];
    bySender[sid].push(String(m._id));
  }
  return bySender;
};

/**
 * Marks 'sent' and 'delivered' messages in a conversation as 'seen'.
 * Only updates messages NOT sent by userId.
 * Returns a map of { [senderId]: [messageId, ...] } for socket emission.
 */
const markSeen = async (conversationId, userId) => {
  const messages = await Message.find(
    {
      conversationId,
      senderId: { $ne: userId },
      status: { $in: ['sent', 'delivered'] },
    },
    '_id senderId'
  ).lean();

  if (!messages.length) return {};

  const ids = messages.map((m) => m._id);
  await Message.updateMany({ _id: { $in: ids } }, { $set: { status: 'seen' } });

  const bySender = {};
  for (const m of messages) {
    const sid = String(m.senderId);
    if (!bySender[sid]) bySender[sid] = [];
    bySender[sid].push(String(m._id));
  }
  return bySender;
};

module.exports = { markDelivered, markSeen };
