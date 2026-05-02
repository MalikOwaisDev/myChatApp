const http = require('http');
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { PORT, CLIENT_URL, NODE_ENV } = require('./config/env');
const logger = require('./utils/logger.util');
const { setSecurityHeaders, globalLimiter } = require('./middleware/security.middleware');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const userSearchRoutes = require('./routes/userSearch.routes');
const conversationRoutes = require('./routes/conversation.routes');
const messageRoutes = require('./routes/message.routes');
const messageStatusRoutes = require('./routes/messageStatus.routes');
const mediaMessageRoutes = require('./routes/mediaMessage.routes');
const settingsRoutes = require('./routes/settings.routes');
const conversationManagementRoutes = require('./routes/conversationManagement.routes');
const blockRoutes = require('./routes/block.routes');
const chatRequestRoutes = require('./routes/chatRequest.routes');
const initSocket = require('./sockets');
const { errorHandler } = require('./middleware/error.middleware');

connectDB();

const app = express();
const httpServer = http.createServer(app);

initSocket(httpServer, CLIENT_URL);

// ─── Security ─────────────────────────────────────────────────────────────────
app.disable('x-powered-by');
app.use(setSecurityHeaders);
// In production the front-end is served from the same origin — no CORS needed.
// In development the Vite dev server runs on a separate port, so we allow it.
app.use(cors({
  origin: NODE_ENV === 'production' ? false : CLIENT_URL,
  credentials: true,
}));
app.use(express.json({ limit: '5mb' }));
app.use(globalLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', userSearchRoutes);
app.use('/api/users', blockRoutes);
app.use('/api/chat-requests', chatRequestRoutes);
app.use('/api/conversations', conversationManagementRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageStatusRoutes);
app.use('/api/messages/media', mediaMessageRoutes);
app.use('/api/messages', messageRoutes);

// ─── Static build (production only) ──────────────────────────────────────────
if (NODE_ENV === 'production') {
  const publicDir = path.join(__dirname, 'public');
  app.use(express.static(publicDir));
  // SPA catch-all: let React Router handle every non-API path
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

app.use(errorHandler);

httpServer.listen(PORT, () => logger.info(`Server running on port ${PORT} [${NODE_ENV}]`));
