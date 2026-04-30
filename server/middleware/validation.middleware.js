const validateProfileUpdate = (req, res, next) => {
  const { name, username } = req.body;

  if (name !== undefined && !String(name).trim()) {
    return res.status(400).json({ message: 'Name cannot be empty' });
  }

  if (username !== undefined) {
    const clean = String(username).trim();
    if (!clean) return res.status(400).json({ message: 'Username cannot be empty' });
    if (/\s/.test(clean)) return res.status(400).json({ message: 'Username must not contain spaces' });
  }

  next();
};

const validatePasswordChange = (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword) return res.status(400).json({ message: 'Current password is required' });
  if (!newPassword) return res.status(400).json({ message: 'New password is required' });
  if (newPassword.length < 6)
    return res.status(400).json({ message: 'New password must be at least 6 characters' });
  next();
};

module.exports = { validateProfileUpdate, validatePasswordChange };
