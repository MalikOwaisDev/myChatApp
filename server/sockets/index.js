const { Server } = require('socket.io');
const socketAuth = require('./middleware/socketAuth');
const notificationHandler = require('./handlers/notification.handler');
const messageHandler = require('./handlers/message.handler');
const presenceHandler = require('./handlers/presence.handler');
const typingHandler = require('./handlers/typing.handler');
const messageStatusHandler = require('./handlers/messageStatus.handler');
const { init } = require('../utils/socketEmitter');

const initSocket = (httpServer, clientUrl) => {
  const io = new Server(httpServer, {
    cors: { origin: clientUrl, credentials: true },
  });

  init(io);
  io.use(socketAuth);
  io.on('connection', (socket) => {
    notificationHandler(io, socket);  // must stay first — registers unregisterSocket on disconnect
    messageHandler(io, socket);
    presenceHandler(io, socket);
    typingHandler(io, socket);
    messageStatusHandler(io, socket);
  });

  return io;
};

module.exports = initSocket;
