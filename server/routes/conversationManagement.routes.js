const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { conversationAccess } = require('../middleware/conversationAccess.middleware');
const {
  muteConversation,
  unmuteConversation,
  deleteConversation,
} = require('../controllers/conversationManagement.controller');

router.use(protect);

router.put('/:id/mute', conversationAccess, muteConversation);
router.put('/:id/unmute', conversationAccess, unmuteConversation);
router.delete('/:id', conversationAccess, deleteConversation);

module.exports = router;
