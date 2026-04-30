const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/user.model');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const searchUsers = asyncHandler(async (req, res) => {
  const raw = String(req.query.query ?? '').trim();

  if (raw.length < 2) {
    return res.status(400).json({ message: 'Query must be at least 2 characters.' });
  }

  const escaped = escapeRegex(raw.toLowerCase());
  const regex = new RegExp(escaped);

  const users = await User.find(
    { username: regex, _id: { $ne: req.user.id } },
    { name: 1, username: 1, profileImage: 1 }
  ).limit(15);

  res.json(users);
});

module.exports = { searchUsers };
