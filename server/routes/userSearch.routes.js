const express = require('express');
const router = express.Router();
const { searchUsers } = require('../controllers/userSearch.controller');
const { protect } = require('../middleware/auth.middleware');
const { createRateLimiter } = require('../middleware/rateLimit.middleware');

const searchLimit = createRateLimiter({
  windowMs: 60_000,
  max: 30,
  message: 'Too many search requests, please slow down.',
});

router.use(protect);
router.get('/search', searchLimit, searchUsers);

module.exports = router;
