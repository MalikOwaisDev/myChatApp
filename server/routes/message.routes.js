const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { conversationAccess } = require('../middleware/conversationAccess.middleware');
const { sendMessage, getMessages } = require('../controllers/message.controller');
const { clearMessages } = require('../controllers/conversationManagement.controller');

const router = express.Router();

router.use(protect);

router.delete('/:conversationId/clear', conversationAccess, clearMessages);
router.post('/:conversationId', conversationAccess, sendMessage);
router.get('/:conversationId', conversationAccess, getMessages);

module.exports = router;
