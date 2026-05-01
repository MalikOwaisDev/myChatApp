const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createRateLimiter } = require('../middleware/rateLimit.middleware');
const { validateMedia } = require('../middleware/fileValidation.middleware');
const { sendMediaMessage } = require('../controllers/mediaMessage.controller');

const mediaSendLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 20,
  message: 'You are sending media too fast. Please slow down.',
});

router.post('/', protect, mediaSendLimiter, validateMedia, sendMediaMessage);

module.exports = router;
