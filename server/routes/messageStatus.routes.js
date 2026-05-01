const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { markMessagesDelivered, markMessagesSeen } = require('../controllers/messageStatus.controller');

const router = express.Router();

router.use(protect);

router.put('/delivered', markMessagesDelivered);
router.put('/seen', markMessagesSeen);

module.exports = router;
