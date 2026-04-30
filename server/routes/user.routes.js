const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, changePassword } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateProfileUpdate, validatePasswordChange } = require('../middleware/validation.middleware');

router.use(protect);

router.get('/profile', getUserProfile);
router.put('/profile', validateProfileUpdate, updateUserProfile);
router.put('/change-password', validatePasswordChange, changePassword);

module.exports = router;
