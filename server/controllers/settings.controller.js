const asyncHandler = require('../utils/asyncHandler');
const { getSettings, updateSettings } = require('../services/settings.service');

const getUserSettings = asyncHandler(async (req, res) => {
  const data = await getSettings(req.user.id);
  res.json(data);
});

const updateUserSettings = asyncHandler(async (req, res) => {
  const settings = await updateSettings(req.user.id, req.body);
  if (!settings) return res.status(400).json({ message: 'No valid settings provided' });
  res.json({ settings });
});

module.exports = { getUserSettings, updateUserSettings };
