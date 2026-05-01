const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getUserSettings, updateUserSettings } = require('../controllers/settings.controller');

router.use(protect);
router.get('/', getUserSettings);
router.put('/', updateUserSettings);

module.exports = router;
