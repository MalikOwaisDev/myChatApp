const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { listIncoming, respondToRequest } = require('../controllers/chatRequest.controller');

router.use(protect);

router.get('/', listIncoming);
router.post('/respond', respondToRequest);

module.exports = router;
