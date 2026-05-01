const { createRateLimiter } = require('./rateLimit.middleware');

// Security response headers (replaces helmet for zero-dependency hardening)
const setSecurityHeaders = (req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '0'); // disabled — rely on CSP instead
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  next();
};

// Broad global rate limit — per-route limits in each router are stricter
const globalLimiter = createRateLimiter({
  windowMs: 15 * 60_000,
  max: 500,
  message: 'Too many requests, please try again later.',
});

module.exports = { setSecurityHeaders, globalLimiter };
