const { validateBase64Image } = require('../utils/image.util');

const validateMedia = (req, res, next) => {
  const { media } = req.body;
  if (!media) return res.status(400).json({ message: 'Media is required' });

  const result = validateBase64Image(media);
  if (!result.valid) return res.status(400).json({ message: result.error });

  const match = media.match(/^data:(image\/[a-z]+);base64,/);
  req.mediaType = match[1];
  next();
};

module.exports = { validateMedia };
