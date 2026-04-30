const requests = new Map();

const createRateLimiter = ({ windowMs = 60_000, max = 30, message = 'Too many requests, please slow down.' } = {}) => {
  return (req, res, next) => {
    const key = req.user?.id ?? req.ip;
    const now = Date.now();
    const timestamps = (requests.get(key) ?? []).filter((t) => now - t < windowMs);

    if (timestamps.length >= max) {
      return res.status(429).json({ message });
    }

    timestamps.push(now);
    requests.set(key, timestamps);
    next();
  };
};

module.exports = { createRateLimiter };
