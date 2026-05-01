const User = require('../models/user.model');

const getSettings = async (userId) => {
  const user = await User.findById(userId, 'settings blockedUsers')
    .populate('blockedUsers', 'name username profileImage')
    .lean();
  return {
    settings: user?.settings ?? { notificationsEnabled: true, soundEnabled: true },
    blockedUsers: user?.blockedUsers ?? [],
  };
};

const updateSettings = async (userId, updates) => {
  const patch = {};
  if (typeof updates.notificationsEnabled === 'boolean') {
    patch['settings.notificationsEnabled'] = updates.notificationsEnabled;
  }
  if (typeof updates.soundEnabled === 'boolean') {
    patch['settings.soundEnabled'] = updates.soundEnabled;
  }
  if (!Object.keys(patch).length) return null;
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: patch },
    { new: true, select: 'settings' }
  );
  return user?.settings;
};

module.exports = { getSettings, updateSettings };
