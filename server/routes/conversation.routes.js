const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { conversationAccess } = require('../middleware/conversationAccess.middleware');
const {
  createOrGetConversation,
  getUserConversations,
  getConversationById,
} = require('../controllers/conversation.controller');

const router = express.Router();

router.use(protect);

router.post('/', createOrGetConversation);
router.get('/', getUserConversations);
router.get('/:id', conversationAccess, getConversationById);

module.exports = router;
