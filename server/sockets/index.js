const { Server } = require('socket.io');
const socketAuth = require('./middleware/socketAuth');
const notificationHandler = require('./handlers/notification.handler');
const messageHandler = require('./handlers/message.handler');
const presenceHandler = require('./handlers/presence.handler');
const typingHandler = require('./handlers/typing.handler');
const messageStatusHandler = require('./handlers/messageStatus.handler');
const mediaHandler = require('./handlers/media.handler');
const { init } = require('../utils/socketEmitter');

const initSocket = (httpServer, clientUrl) => {
  const isProd = process.env.NODE_ENV === 'production';
  const io = new Server(httpServer, {
    // In production the client is served from the same origin — disable CORS.
    cors: isProd ? false : { origin: clientUrl, credentials: true },
  });

  init(io);
  io.use(socketAuth);
  io.on('connection', (socket) => {
    notificationHandler(io, socket);  // must stay first — registers unregisterSocket on disconnect
    messageHandler(io, socket);
    presenceHandler(io, socket);
    typingHandler(io, socket);
    messageStatusHandler(io, socket);
    mediaHandler(io, socket);
  });

  return io;
};

module.exports = initSocket;
