const User = require('../models/user.model');
const { generateJWT, generateRawResetToken } = require('../utils/token.util');
const { hashToken } = require('../utils/hash.util');
const { sendPasswordResetEmail } = require('../services/email.service');
const { RESET_TOKEN_EXPIRE_MINUTES } = require('../config/env');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const [existingEmail, existingUsername] = await Promise.all([
    User.findOne({ email }),
    User.findOne({ username }),
  ]);

  if (existingEmail || existingUsername) {
    return res.status(409).json({ message: 'Email or username already in use' });
  }

  const user = await User.create({ name, username, email, password });
  const token = generateJWT(user._id);

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
    },
  });
});

// POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateJWT(user._id);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
    },
  });
});

// POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: 'If that email exists, a reset link has been sent' });
  }

  const rawToken = generateRawResetToken();
  const hashed = hashToken(rawToken);
  const expireMs = RESET_TOKEN_EXPIRE_MINUTES * 60 * 1000;

  user.resetPasswordToken = hashed;
  user.resetPasswordExpire = new Date(Date.now() + expireMs);
  await user.save({ validateBeforeSave: false });

  try {
    await sendPasswordResetEmail(user.email, rawToken);
    res.json({ message: 'If that email exists, a reset link has been sent' });
  } catch {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({ message: 'Failed to send email. Try again later.' });
  }
});

// POST /api/auth/reset-password
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const hashed = hashToken(token);

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire');

  if (!user) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
});

// GET /api/auth/me
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    profileImage: user.profileImage,
    createdAt: user.createdAt,
  });
});

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, getCurrentUser };
