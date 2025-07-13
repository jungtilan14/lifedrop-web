const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE || '24h'
    }
  );
};

// Middleware to authenticate token
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token - user not found'
      });
    }

    // Check if account is locked
    if (user.isAccountLocked()) {
      return res.status(423).json({
        success: false,
        error: 'Account is temporarily locked due to multiple failed login attempts'
      });
    }

    // Update last login
    await user.update({ last_login: new Date() });

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Token authentication failed'
    });
  }
};

// Middleware to check user roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware to check if user is verified
const requireVerification = (req, res, next) => {
  if (!req.user.is_verified) {
    return res.status(403).json({
      success: false,
      error: 'Account verification required'
    });
  }
  next();
};

// Middleware to check if user is email verified
const requireEmailVerification = (req, res, next) => {
  if (!req.user.email_verified) {
    return res.status(403).json({
      success: false,
      error: 'Email verification required'
    });
  }
  next();
};

// Middleware to check if donor is available
const requireDonorAvailability = (req, res, next) => {
  if (req.user.role === 'donor' && !req.user.is_available) {
    return res.status(403).json({
      success: false,
      error: 'Donor account is not available for requests'
    });
  }
  next();
};

// Middleware to check if donor can donate
const requireDonorEligibility = (req, res, next) => {
  if (req.user.role === 'donor') {
    if (!req.user.canDonate()) {
      return res.status(403).json({
        success: false,
        error: 'You are not eligible to donate blood yet. Please wait for the required interval.'
      });
    }
  }
  next();
};

// Middleware to check if user belongs to hospital
const requireHospitalAccess = async (req, res, next) => {
  try {
    const hospitalId = req.params.hospitalId || req.body.hospital_id;
    
    if (!hospitalId) {
      return res.status(400).json({
        success: false,
        error: 'Hospital ID is required'
      });
    }

    // Admin can access any hospital
    if (req.user.role === 'admin') {
      return next();
    }

    // Hospital admin can only access their own hospital
    if (req.user.role === 'hospital_admin' && req.user.hospital_id !== hospitalId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied to this hospital'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Hospital access check failed'
    });
  }
};

// Middleware to check resource ownership
const requireOwnership = (resourceField = 'user_id') => {
  return (req, res, next) => {
    const resourceId = req.params.id || req.body.id;
    
    if (!resourceId) {
      return res.status(400).json({
        success: false,
        error: 'Resource ID is required'
      });
    }

    // Admin can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check ownership in the next middleware or controller
    req.checkOwnership = {
      field: resourceField,
      userId: req.user.id
    };
    
    next();
  };
};

// Optional authentication - doesn't fail if no token
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (user && !user.isAccountLocked()) {
      req.user = user;
    }
  } catch (error) {
    // Ignore errors for optional auth
  }
  
  next();
};

module.exports = {
  generateToken,
  authenticate,
  authorize,
  requireVerification,
  requireEmailVerification,
  requireDonorAvailability,
  requireDonorEligibility,
  requireHospitalAccess,
  requireOwnership,
  optionalAuth
};