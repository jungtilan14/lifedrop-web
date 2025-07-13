const { ValidationError } = require('sequelize');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle Sequelize validation errors
const handleSequelizeValidationError = (err) => {
  const errors = err.errors.map(error => ({
    field: error.path,
    message: error.message
  }));
  
  return new AppError(`Validation error: ${errors.map(e => e.message).join(', ')}`, 400);
};

// Handle Sequelize unique constraint errors
const handleSequelizeUniqueConstraintError = (err) => {
  const field = err.errors[0].path;
  const message = `${field} already exists. Please use a different value.`;
  
  return new AppError(message, 409);
};

// Handle Sequelize foreign key constraint errors
const handleSequelizeForeignKeyConstraintError = (err) => {
  const message = 'Invalid reference to related resource.';
  return new AppError(message, 400);
};

// Handle JWT errors
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again.', 401);
};

// Handle JWT expired errors
const handleJWTExpiredError = () => {
  return new AppError('Your token has expired. Please log in again.', 401);
};

// Handle multer errors
const handleMulterError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('File size too large. Maximum size is 5MB.', 400);
  }
  
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new AppError('Too many files uploaded.', 400);
  }
  
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return new AppError('Unexpected file field.', 400);
  }
  
  return new AppError('File upload error.', 400);
};

// Handle database connection errors
const handleDatabaseError = (err) => {
  if (err.name === 'SequelizeConnectionError') {
    return new AppError('Database connection failed. Please try again later.', 500);
  }
  
  if (err.name === 'SequelizeTimeoutError') {
    return new AppError('Database operation timed out. Please try again later.', 500);
  }
  
  return new AppError('Database error occurred.', 500);
};

// Send error response for development
const sendErrorDev = (err, req, res) => {
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
    stack: err.stack,
    details: err
  });
};

// Send error response for production
const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('ERROR 💥', err);
    
    res.status(500).json({
      success: false,
      error: 'Something went wrong!'
    });
  }
};

// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle different types of errors
    if (error.name === 'SequelizeValidationError') {
      error = handleSequelizeValidationError(error);
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      error = handleSequelizeUniqueConstraintError(error);
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
      error = handleSequelizeForeignKeyConstraintError(error);
    } else if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    } else if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    } else if (error.name === 'MulterError') {
      error = handleMulterError(error);
    } else if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeTimeoutError') {
      error = handleDatabaseError(error);
    }

    sendErrorProd(error, req, res);
  }
};

// Catch async errors wrapper
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// Handle unhandled routes
const handleUnhandledRoute = (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
  next(err);
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  process.exit(0);
});

module.exports = {
  AppError,
  globalErrorHandler,
  catchAsync,
  handleUnhandledRoute
};