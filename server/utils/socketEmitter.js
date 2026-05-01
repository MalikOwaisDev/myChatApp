let _io = null;
const userSockets = new Map(); // userId -> Set<socketId>

const init = (io) => { _io = io; };

const registerUser = (userId, socketId) => {
  if (!userSockets.has(userId)) userSockets.set(userId, new Set());
  userSockets.get(userId).add(socketId);
};

const unregisterSocket = (userId, socketId) => {
  const sockets = userSockets.get(userId);
  if (!sockets) return;
  sockets.delete(socketId);
  if (sockets.size === 0) userSockets.delete(userId);
};

const emitToUser = (userId, event, data) => {
  if (!_io) return;
  const sockets = userSockets.get(String(userId));
  if (!sockets) return;
  for (const socketId of sockets) {
    _io.to(socketId).emit(event, data);
  }
};

const isOnline = (userId) => {
  const sockets = userSockets.get(String(userId));
  return Boolean(sockets && sockets.size > 0);
};

const getAllOnlineUserIds = () => Array.from(userSockets.keys());

module.exports = { init, registerUser, unregisterSocket, emitToUser, isOnline, getAllOnlineUserIds };
