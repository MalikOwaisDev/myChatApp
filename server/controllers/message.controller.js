const asyncHandler = require('../utils/asyncHandler');
const messageService = require('../services/message.service');
const paginationService = require('../services/pagination.service');
const { emitToUser } = require('../utils/socketEmitter');

const sendMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Message text is required' });
  }

  if (text.trim().length > 2000) {
    return res.status(400).json({ message: 'Message cannot exceed 2000 characters' });
  }

  const conversation = req.conversation;
  const message = await messageService.createMessage(
    conversation._id,
    req.user.id,
    text.trim()
  );

  const payload = {
    _id: message._id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    text: message.text,
    messageType: message.messageType,
    createdAt: message.createdAt,
  };

  for (const participantId of conversation.participants) {
    emitToUser(String(participantId), 'receive_message', payload);
  }

  res.status(201).json(payload);
});

const getMessages = asyncHandler(async (req, res) => {
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 30));
  const cursor = req.query.cursor || null;

  const result = await paginationService.getPagedMessages(
    req.conversation._id,
    req.user.id,
    cursor,
    limit
  );

  res.json(result);
});

module.exports = { sendMessage, getMessages };
