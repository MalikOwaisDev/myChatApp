const { registerUser, unregisterSocket } = require('../../utils/socketEmitter');

const notificationHandler = (io, socket) => {
  registerUser(socket.userId, socket.id);

  socket.on('disconnect', () => {
    unregisterSocket(socket.userId, socket.id);
  });
};

module.exports = notificationHandler;
