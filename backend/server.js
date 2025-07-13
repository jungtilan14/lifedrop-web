require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const http = require('http');
const path = require('path');

// Import models and database
const { testConnection, syncDatabase } = require('./models');

// Import middleware
const { globalErrorHandler, handleUnhandledRoute } = require('./middlewares/errorHandler');
const { corsOptions, securityHeaders, sanitizeInput, requestLogger } = require('./middlewares/security');

// Import services
const notificationService = require('./services/notificationService');

// Create Express app
const app = express();
const server = http.createServer(app);

// Trust proxy for proper IP detection
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(sanitizeInput);
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'LifeDrop API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/blood-requests', require('./routes/bloodRequests'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin', require('./routes/admin'));

// Handle unhandled routes
app.all('*', handleUnhandledRoute);

// Global error handler
app.use(globalErrorHandler);

// Initialize Socket.IO
notificationService.initializeSocket(server);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await testConnection();
    
    // Sync database
    await syncDatabase();
    
    // Start server
    server.listen(PORT, () => {
      console.log(`
🚀 LifeDrop API Server is running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔗 API URL: http://localhost:${PORT}
📚 Health Check: http://localhost:${PORT}/health
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;