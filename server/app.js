const http = require('http');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { PORT, CLIENT_URL } = require('./config/env');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
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

app.use(errorHandler);

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
