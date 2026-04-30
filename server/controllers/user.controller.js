const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/user.service');
const { emitToUser } = require('../utils/socketEmitter');

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  res.json(user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  emitToUser(req.user.id, 'notification', {
    id: Date.now(),
    type: 'success',
    message: 'Your profile has been updated successfully.',
    timestamp: new Date().toISOString(),
  });
  res.json({ message: 'Profile updated successfully', user });
});

const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user.id, req.body);
  emitToUser(req.user.id, 'notification', {
    id: Date.now(),
    type: 'warning',
    message: 'Your password was changed. If this was not you, contact support immediately.',
    timestamp: new Date().toISOString(),
  });
  res.json({ message: 'Password changed successfully' });
});

module.exports = { getUserProfile, updateUserProfile, changePassword };
