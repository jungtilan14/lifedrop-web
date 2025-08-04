const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { User } = require('../models');

// Rate limiting configuration
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      error: message
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for admin users
      return req.user && req.user.role === 'admin';
    }
  });
};

// General API rate limiting
const generalLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
);

// Strict rate limiting for authentication endpoints
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per windowMs
  'Too many login attempts, please try again later.'
);

// Password reset rate limiting
const passwordResetLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  3, // limit each IP to 3 password reset requests per hour
  'Too many password reset attempts, please try again later.'
);

// Blood request creation rate limiting
const bloodRequestLimiter = createRateLimiter(
  60 * 60 * 1000, // 1 hour
  10, // limit each IP to 10 blood requests per hour
  'Too many blood requests, please try again later.'
);

// File upload rate limiting
const uploadLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  20, // limit each IP to 20 file uploads per 15 minutes
  'Too many file uploads, please try again later.'
);

// Account lockout middleware
const accountLockout = async (req, res, next) => {
  const { email } = req.body;
  const maxAttempts = 5;
  const lockoutTime = 15 * 60 * 1000; // 15 minutes

  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return next();
    }

    // Check if account is locked
    if (user.locked_until && user.locked_until > new Date()) {
      return res.status(423).json({
        success: false,
        error: 'Account is temporarily locked due to multiple failed login attempts',
        locked_until: user.locked_until
      });
    }

    // Reset attempts if lockout period has passed
    if (user.locked_until && user.locked_until <= new Date()) {
      await user.update({
        login_attempts: 0,
        locked_until: null
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Account lockout check error:', error);
    next();
  }
};

// Failed login handler
const handleFailedLogin = async (email) => {
  const maxAttempts = 5;
  const lockoutTime = 15 * 60 * 1000; // 15 minutes

  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return;
    }

    const attempts = user.login_attempts + 1;
    
    if (attempts >= maxAttempts) {
      await user.update({
        login_attempts: attempts,
        locked_until: new Date(Date.now() + lockoutTime)
      });
    } else {
      await user.update({
        login_attempts: attempts
      });
    }
  } catch (error) {
    console.error('Failed login handler error:', error);
  }
};

// Successful login handler
const handleSuccessfulLogin = async (user) => {
  try {
    await user.update({
      login_attempts: 0,
      locked_until: null,
      last_login: new Date()
    });
  } catch (error) {
    console.error('Successful login handler error:', error);
  }
};

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    return value;
  };

  const sanitizeObject = (obj) => {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'object') {
            sanitizeObject(obj[key]);
          } else {
            obj[key] = sanitizeValue(obj[key]);
          }
        }
      }
    }
  };

  sanitizeObject(req.body);
  sanitizeObject(req.query);
  sanitizeObject(req.params);

  next();
};

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CORS_ORIGIN || 'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002'
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const userInfo = req.user ? `User: ${req.user.email}` : 'Anonymous';
    
    console.log(`${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - ${userInfo}`);
  });
  
  next();
};

// IP whitelist middleware (for admin operations)
const ipWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    if (allowedIPs.length === 0) {
      return next();
    }
    
    if (allowedIPs.includes(clientIP)) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      error: 'Access denied from this IP address'
    });
  };
};

// API key validation middleware (for external integrations)
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: 'API key is required'
    });
  }
  
  const validApiKeys = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
  
  if (!validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key'
    });
  }
  
  next();
};

// Request size limiting middleware
const requestSizeLimit = (limit = '10mb') => {
  return (req, res, next) => {
    const contentLength = req.headers['content-length'];
    
    if (contentLength && parseInt(contentLength) > limit) {
      return res.status(413).json({
        success: false,
        error: 'Request entity too large'
      });
    }
    
    next();
  };
};

// Security audit logging
const auditLogger = (req, res, next) => {
  const sensitiveEndpoints = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/reset-password',
    '/api/admin'
  ];
  
  const isSensitive = sensitiveEndpoints.some(endpoint => 
    req.originalUrl.includes(endpoint)
  );
  
  if (isSensitive) {
    const auditData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      userId: req.user ? req.user.id : null,
      email: req.user ? req.user.email : null
    };
    
    // Log to file or database
    console.log('SECURITY AUDIT:', JSON.stringify(auditData));
  }
  
  next();
};

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  bloodRequestLimiter,
  uploadLimiter,
  accountLockout,
  handleFailedLogin,
  handleSuccessfulLogin,
  securityHeaders,
  sanitizeInput,
  corsOptions,
  requestLogger,
  ipWhitelist,
  validateApiKey,
  requestSizeLimit,
  auditLogger
};