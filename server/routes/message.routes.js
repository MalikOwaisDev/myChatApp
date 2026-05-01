const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { conversationAccess } = require('../middleware/conversationAccess.middleware');
const { sendMessage, getMessages } = require('../controllers/message.controller');

const router = express.Router();

router.use(protect);

router.post('/:conversationId', conversationAccess, sendMessage);
router.get('/:conversationId', conversationAccess, getMessages);

module.exports = router;
