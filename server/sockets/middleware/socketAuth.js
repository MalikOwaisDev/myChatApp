const { verifyJWT } = require('../../utils/token.util');

const socketAuth = (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication error: no token'));
  try {
    const decoded = verifyJWT(token);
    socket.userId = String(decoded.id);
    next();
  } catch {
    next(new Error('Authentication error: invalid token'));
  }
};

module.exports = socketAuth;
