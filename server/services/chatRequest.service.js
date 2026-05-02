const ChatRequest = require('../models/chatRequest.model');
const Message = require('../models/message.model');

/**
 * Called before saving a new message.
 * Creates a chat request on first message in a conversation.
 * Returns { allowed: true } or { allowed: false, error: string }.
 */
const checkAndEnforce = async (conversationId, senderId, recipientId) => {
  let request = await ChatRequest.findOne({ conversationId }).lean();

  if (!request) {
    const newReq = await ChatRequest.create({
      from: senderId,
      to: recipientId,
      conversationId,
      status: 'pending',
    });
    return { allowed: true, newRequest: newReq };
  }

  if (request.status === 'accepted') return { allowed: true };

  if (request.status === 'rejected') {
    return { allowed: false, error: 'Your message request was declined.' };
  }

  // status = pending
  if (String(request.from) === String(senderId)) {
    // Requester trying to send while still pending — block after the first message
    const count = await Message.countDocuments({ conversationId, senderId });
    if (count >= 1) {
      return { allowed: false, error: 'Waiting for the other person to accept your request.' };
    }
  }
  // Recipient messaging while request is pending auto-accepts
  if (String(request.to) === String(senderId)) {
    await ChatRequest.updateOne({ conversationId }, { status: 'accepted' });
  }

  return { allowed: true };
};

/**
 * Returns incoming pending requests for a user, with sender info populated.
 */
const getIncoming = async (userId) => {
  return ChatRequest.find({ to: userId, status: 'pending' })
    .populate('from', 'name username profileImage')
    .populate('conversationId', '_id')
    .sort({ createdAt: -1 })
    .lean();
};

/**
 * Accepts or rejects a chat request. Returns the updated request.
 */
const respond = async (requestId, userId, action) => {
  const request = await ChatRequest.findOne({ _id: requestId, to: userId });
  if (!request) return null;
  if (request.status !== 'pending') return null;
  request.status = action === 'accept' ? 'accepted' : 'rejected';
  await request.save();
  return request;
};

module.exports = { checkAndEnforce, getIncoming, respond };
