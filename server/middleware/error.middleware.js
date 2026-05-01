const { NODE_ENV } = require('../config/env');
const logger = require('../utils/logger.util');

const errorHandler = (err, req, res, next) => {
  if (NODE_ENV === 'production') {
    logger.error(`${req.method} ${req.path} — ${err.message}`);
  } else {
    logger.error(err.stack);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages[0] });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `${field} already in use` });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  const statusCode = err.statusCode || 500;
  const body = { message: err.message || 'Internal server error' };

  // Never expose stack traces in production
  if (NODE_ENV !== 'production') {
    body.stack = err.stack;
  }

  res.status(statusCode).json(body);
};

module.exports = { errorHandler };
