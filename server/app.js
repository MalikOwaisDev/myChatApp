const http = require('http');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { PORT, CLIENT_URL } = require('./config/env');
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
const initSocket = require('./sockets');
const { errorHandler } = require('./middleware/error.middleware');

connectDB();

const app = express();
const httpServer = http.createServer(app);

initSocket(httpServer, CLIENT_URL);

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '5mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/users', userSearchRoutes);
app.use('/api/users', blockRoutes);
app.use('/api/conversations', conversationManagementRoutes); // PUT/DELETE mgmt — before base routes
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageStatusRoutes);    // PUT /delivered, PUT /seen — before dynamic routes
app.use('/api/messages/media', mediaMessageRoutes); // POST /media — before :conversationId routes
app.use('/api/messages', messageRoutes);

app.use(errorHandler);

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
