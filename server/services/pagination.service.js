const Message = require('../models/message.model');

/**
 * Cursor-based message pagination.
 * cursor = _id of the oldest message currently loaded (fetch messages older than this).
 * Returns messages in ascending chronological order (oldest first).
 */
const getPagedMessages = async (conversationId, userId, cursor, limit) => {
  const query = {
    conversationId,
    deletedFor: { $nin: [userId] },
  };

  if (cursor) {
    query._id = { $lt: cursor };
  }

  // Fetch limit+1 to detect whether more pages exist
  const fetched = await Message.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1)
    .lean();

  const hasMore = fetched.length > limit;
  if (hasMore) fetched.pop();

  const messages = fetched.reverse();

  return {
    messages,
    hasMore,
    nextCursor: messages.length > 0 ? String(messages[0]._id) : null,
  };
};

module.exports = { getPagedMessages };
