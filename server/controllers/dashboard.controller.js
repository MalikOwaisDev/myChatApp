const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/user.model');

const getDashboardData = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const stats = {
    memberSince: user.createdAt,
    profileComplete: !!(user.name && user.username && user.profileImage),
    messages: 0,
    conversations: 0,
  };

  res.json({ user, stats });
});

module.exports = { getDashboardData };
