const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { blockUser, unblockUser } = require('../controllers/block.controller');

router.use(protect);
router.post('/block', blockUser);
router.post('/unblock', unblockUser);

module.exports = router;
