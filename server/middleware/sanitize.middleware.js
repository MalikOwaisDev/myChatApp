const stripHtml = (str) =>
  str
    .replace(/<[^>]*>/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

const sanitizeBody = (req, res, next) => {
  if (typeof req.body.text === 'string') {
    req.body.text = stripHtml(req.body.text).trim();
  }
  next();
};

module.exports = { sanitizeBody };
