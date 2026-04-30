const validateBase64Image = (base64) => {
  if (!base64) return { valid: false, error: 'No image provided' };

  const match = base64.match(/^data:image\/(jpeg|jpg|png|webp|gif);base64,(.+)$/);
  if (!match) return { valid: false, error: 'Invalid image format. Use JPEG, PNG, WebP, or GIF' };

  // base64 overhead is ~33%; limit original to ~1MB
  const bytes = (match[2].length * 3) / 4;
  if (bytes > 1_048_576) return { valid: false, error: 'Image must be under 1MB' };

  return { valid: true };
};

module.exports = { validateBase64Image };
