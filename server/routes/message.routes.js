const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { conversationAccess } = require('../middleware/conversationAccess.middleware');
const { createRateLimiter } = require('../middleware/rateLimit.middleware');
const { sanitizeBody } = require('../middleware/sanitize.middleware');
const { sendMessage, getMessages } = require('../controllers/message.controller');
const { clearMessages } = require('../controllers/conversationManagement.controller');

const router = express.Router();

const messageSendLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 30,
  message: 'You are sending messages too fast. Please slow down.',
});

router.use(protect);

router.delete('/:conversationId/clear', conversationAccess, clearMessages);
router.post('/:conversationId', conversationAccess, messageSendLimiter, sanitizeBody, sendMessage);
router.get('/:conversationId', conversationAccess, getMessages);

module.exports = router;
