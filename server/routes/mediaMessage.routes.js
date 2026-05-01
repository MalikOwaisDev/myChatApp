const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { validateMedia } = require('../middleware/fileValidation.middleware');
const { sendMediaMessage } = require('../controllers/mediaMessage.controller');

router.post('/', protect, validateMedia, sendMediaMessage);

module.exports = router;
