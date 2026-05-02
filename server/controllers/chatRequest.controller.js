const asyncHandler = require('../utils/asyncHandler');
const chatRequestService = require('../services/chatRequest.service');
const { emitToUser } = require('../utils/socketEmitter');

const listIncoming = asyncHandler(async (req, res) => {
  const requests = await chatRequestService.getIncoming(req.user.id);
  res.json(requests);
});

const respondToRequest = asyncHandler(async (req, res) => {
  const { requestId, action } = req.body;

  if (!requestId || !['accept', 'reject'].includes(action)) {
    return res.status(400).json({ message: 'requestId and action (accept|reject) are required' });
  }

  const request = await chatRequestService.respond(requestId, req.user.id, action);
  if (!request) {
    return res.status(404).json({ message: 'Request not found or already handled' });
  }

  // Notify the requester of the decision
  emitToUser(String(request.from), 'chat_request_update', {
    conversationId: String(request.conversationId),
    status: request.status,
  });

  res.json({ status: request.status, conversationId: String(request.conversationId) });
});

module.exports = { listIncoming, respondToRequest };
