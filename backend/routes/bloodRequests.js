require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const http = require('http');
const path = require('path');

// Import models and database connection methods
const { testConnection, syncDatabase } = require('./models');

// Import middleware for handling errors, security, etc.
const { globalErrorHandler, handleUnhandledRoute } = require('./middlewares/errorHandler');
const { corsOptions, securityHeaders, sanitizeInput, requestLogger } = require('./middlewares/security');

// Import services for Socket.IO notifications (if required)
const notificationService = require('./services/notificationService');

// Import API routes
const usersRoutes = require('./routes/users');
const hospitalsRoutes = require('./routes/hospitals');
const bloodRequestsRoutes = require('./routes/bloodRequests');  // Added Blood Requests route
const donationsRoutes = require('./routes/donations');
const notificationsRoutes = require('./routes/notifications');

// Create the Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Trust proxy for IP detection
app.set('trust proxy', 1);

// Apply security middleware
app.use(helmet());
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(sanitizeInput);
app.use(requestLogger);

// Apply body parsing middleware for JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Enable logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve static files (for example, uploaded files)
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

// Register API routes
app.use('/api/users', usersRoutes);              // Users routes
app.use('/api/hospitals', hospitalsRoutes);      // Hospitals routes
app.use('/api/blood-requests', bloodRequestsRoutes); // Blood Requests routes
app.use('/api/donations', donationsRoutes);     // Donations routes
app.use('/api/notifications', notificationsRoutes); // Notifications routes

// Handle unhandled routes (404 errors)
app.all('*', handleUnhandledRoute);

// Apply the global error handler
app.use(globalErrorHandler);

// Initialize Socket.IO if necessary
notificationService.initializeSocket(server);

// Start the server after successful DB connection and sync
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test the database connection
    await testConnection();

    // Sync the database (create tables if not exist)
    await syncDatabase();

    // Start the server
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
