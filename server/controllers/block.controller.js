const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/user.model');

const blockUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ message: 'userId is required' });
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }
  if (String(userId) === String(req.user.id)) {
    return res.status(400).json({ message: 'Cannot block yourself' });
  }

  const target = await User.findById(userId, 'name username profileImage').lean();
  if (!target) return res.status(404).json({ message: 'User not found' });

  await User.findByIdAndUpdate(req.user.id, { $addToSet: { blockedUsers: userId } });
  res.json({ blocked: true, user: target });
});

const unblockUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) return res.status(400).json({ message: 'userId is required' });
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  await User.findByIdAndUpdate(req.user.id, { $pull: { blockedUsers: userId } });
  res.json({ unblocked: true });
});

module.exports = { blockUser, unblockUser };
