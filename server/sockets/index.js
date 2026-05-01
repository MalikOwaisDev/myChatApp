const { Server } = require('socket.io');
const socketAuth = require('./middleware/socketAuth');
const notificationHandler = require('./handlers/notification.handler');
const messageHandler = require('./handlers/message.handler');
const { init } = require('../utils/socketEmitter');

const initSocket = (httpServer, clientUrl) => {
  const io = new Server(httpServer, {
    cors: { origin: clientUrl, credentials: true },
  });

  init(io);
  io.use(socketAuth);
  io.on('connection', (socket) => {
    notificationHandler(io, socket);
    messageHandler(io, socket);
  });

  return io;
};

module.exports = initSocket;
