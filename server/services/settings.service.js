const User = require('../models/user.model');

const getSettings = async (userId) => {
  const user = await User.findById(userId, 'settings blockedUsers isPublic')
    .populate('blockedUsers', 'name username profileImage')
    .lean();
  return {
    settings: user?.settings ?? { notificationsEnabled: true, soundEnabled: true },
    blockedUsers: user?.blockedUsers ?? [],
    isPublic: user?.isPublic ?? true,
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
  if (typeof updates.isPublic === 'boolean') {
    patch.isPublic = updates.isPublic;
  }
  if (!Object.keys(patch).length) return null;
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: patch },
    { new: true, select: 'settings isPublic' }
  );
  return { settings: user?.settings, isPublic: user?.isPublic ?? true };
};

module.exports = { getSettings, updateSettings };
