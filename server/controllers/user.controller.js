const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/user.service');

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await userService.getProfile(req.user.id);
  res.json(user);
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user.id, req.body);
  res.json({ message: 'Profile updated successfully', user });
});

const changePassword = asyncHandler(async (req, res) => {
  await userService.changePassword(req.user.id, req.body);
  res.json({ message: 'Password changed successfully' });
});

module.exports = { getUserProfile, updateUserProfile, changePassword };
