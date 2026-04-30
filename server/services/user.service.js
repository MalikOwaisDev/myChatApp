const User = require('../models/user.model');
const { validateBase64Image } = require('../utils/image.util');

const makeError = (message, statusCode) =>
  Object.assign(new Error(message), { statusCode });

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw makeError('User not found', 404);
  return user;
};

const updateProfile = async (userId, { name, username, profileImage }) => {
  const user = await User.findById(userId);
  if (!user) throw makeError('User not found', 404);

  if (name !== undefined) {
    if (!String(name).trim()) throw makeError('Name is required', 400);
    user.name = String(name).trim();
  }

  if (username !== undefined) {
    const clean = String(username).trim().toLowerCase();
    if (!clean) throw makeError('Username is required', 400);
    if (/\s/.test(clean)) throw makeError('Username must not contain spaces', 400);
    if (!/^[a-z0-9_.@-]+$/.test(clean))
      throw makeError('Username can only contain letters, numbers, underscores, dots, and hyphens', 400);

    const taken = await User.findOne({ username: clean, _id: { $ne: userId } });
    if (taken) throw makeError('Username is already taken', 409);
    user.username = clean;
  }

  if (profileImage !== undefined) {
    if (!profileImage) {
      user.profileImage = null;
    } else {
      const { valid, error } = validateBase64Image(profileImage);
      if (!valid) throw makeError(error, 400);
      user.profileImage = profileImage;
    }
  }

  await user.save();
  return user;
};

const changePassword = async (userId, { oldPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw makeError('User not found', 404);

  const match = await user.matchPassword(oldPassword);
  if (!match) throw makeError('Current password is incorrect', 400);

  const sameAsOld = await user.matchPassword(newPassword);
  if (sameAsOld) throw makeError('New password must differ from your current password', 400);

  user.password = newPassword;
  await user.save();
};

module.exports = { getProfile, updateProfile, changePassword };
