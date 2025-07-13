const { body, param, query, validationResult } = require('express-validator');

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('first_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name must be 2-50 characters and contain only letters'),
  
  body('last_name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name must be 2-50 characters and contain only letters'),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character'),
  
  body('phone')
    .trim()
    .matches(/^\+?[\d\s\-\(\)]{10,15}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('role')
    .optional()
    .isIn(['donor', 'hospital_admin'])
    .withMessage('Role must be either donor or hospital_admin'),
  
  body('blood_type')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Please provide a valid blood type'),
  
  body('date_of_birth')
    .optional()
    .isDate()
    .custom((value) => {
      const age = new Date().getFullYear() - new Date(value).getFullYear();
      if (age < 18 || age > 65) {
        throw new Error('Age must be between 18 and 65 years');
      }
      return true;
    }),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other'])
    .withMessage('Gender must be male, female, or other'),
  
  body('city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be 2-100 characters'),
  
  body('state')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('State must be 2-100 characters'),
  
  body('pincode')
    .optional()
    .matches(/^[0-9]{6}$/)
    .withMessage('Pincode must be 6 digits'),
  
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Password reset validation
const validatePasswordReset = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  handleValidationErrors
];

// Password update validation
const validatePasswordUpdate = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
  
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character'),
  
  handleValidationErrors
];

// Hospital registration validation
const validateHospitalRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Hospital name must be 2-100 characters'),
  
  body('registration_number')
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Registration number must be 5-50 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('phone')
    .trim()
    .matches(/^\+?[\d\s\-\(\)]{10,15}$/)
    .withMessage('Please provide a valid phone number'),
  
  body('address')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Address must be 10-500 characters'),
  
  body('city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be 2-100 characters'),
  
  body('state')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('State must be 2-100 characters'),
  
  body('pincode')
    .matches(/^[0-9]{6}$/)
    .withMessage('Pincode must be 6 digits'),
  
  body('hospital_type')
    .optional()
    .isIn(['government', 'private', 'charitable', 'military'])
    .withMessage('Hospital type must be government, private, charitable, or military'),
  
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  handleValidationErrors
];

// Blood request validation
const validateBloodRequest = [
  body('blood_type')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Please provide a valid blood type'),
  
  body('quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10'),
  
  body('urgency_level')
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Urgency level must be low, medium, high, or critical'),
  
  body('patient_name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Patient name must be 2-100 characters and contain only letters'),
  
  body('patient_age')
    .isInt({ min: 0, max: 120 })
    .withMessage('Patient age must be between 0 and 120'),
  
  body('patient_gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Patient gender must be male, female, or other'),
  
  body('contact_person')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Contact person name must be 2-100 characters'),
  
  body('contact_phone')
    .trim()
    .matches(/^\+?[\d\s\-\(\)]{10,15}$/)
    .withMessage('Please provide a valid contact phone number'),
  
  body('contact_email')
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid contact email'),
  
  body('required_by')
    .isISO8601()
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Required by date must be in the future');
      }
      return true;
    })
    .withMessage('Please provide a valid future date'),
  
  body('location')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Location must be 10-500 characters'),
  
  body('city')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be 2-100 characters'),
  
  body('state')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('State must be 2-100 characters'),
  
  body('pincode')
    .matches(/^[0-9]{6}$/)
    .withMessage('Pincode must be 6 digits'),
  
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  handleValidationErrors
];

// Blood request status update validation
const validateBloodRequestStatusUpdate = [
  body('status')
    .isIn(['accepted', 'rejected', 'completed', 'cancelled'])
    .withMessage('Status must be accepted, rejected, completed, or cancelled'),
  
  body('status_reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Status reason must be less than 500 characters'),
  
  body('donation_date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid donation date'),
  
  body('donation_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide a valid time in HH:MM format'),
  
  handleValidationErrors
];

// Donation history validation
const validateDonationHistory = [
  body('donor_id')
    .isUUID()
    .withMessage('Please provide a valid donor ID'),
  
  body('hospital_id')
    .isUUID()
    .withMessage('Please provide a valid hospital ID'),
  
  body('blood_type')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Please provide a valid blood type'),
  
  body('quantity')
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10'),
  
  body('volume_ml')
    .isInt({ min: 100, max: 500 })
    .withMessage('Volume must be between 100 and 500 ml'),
  
  body('hemoglobin_level')
    .optional()
    .isFloat({ min: 8.0, max: 20.0 })
    .withMessage('Hemoglobin level must be between 8.0 and 20.0'),
  
  body('donation_type')
    .optional()
    .isIn(['whole_blood', 'plasma', 'platelets', 'red_cells', 'granulocytes'])
    .withMessage('Donation type must be whole_blood, plasma, platelets, red_cells, or granulocytes'),
  
  body('donation_method')
    .optional()
    .isIn(['voluntary', 'replacement', 'emergency', 'autologous'])
    .withMessage('Donation method must be voluntary, replacement, emergency, or autologous'),
  
  handleValidationErrors
];

// Query parameter validation
const validateSearchQuery = [
  query('blood_type')
    .optional()
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage('Please provide a valid blood type'),
  
  query('city')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be 2-100 characters'),
  
  query('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  query('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  query('radius')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Radius must be between 1 and 100 km'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

// UUID parameter validation
const validateUUID = [
  param('id')
    .isUUID()
    .withMessage('Please provide a valid ID'),
  
  handleValidationErrors
];

// File upload validation
const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: 'File is required'
    });
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type. Only JPEG, PNG, GIF, and PDF files are allowed'
    });
  }

  // Check file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (req.file.size > maxSize) {
    return res.status(400).json({
      success: false,
      error: 'File size must be less than 5MB'
    });
  }

  next();
};

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validatePasswordReset,
  validatePasswordUpdate,
  validateHospitalRegistration,
  validateBloodRequest,
  validateBloodRequestStatusUpdate,
  validateDonationHistory,
  validateSearchQuery,
  validateUUID,
  validateFileUpload
};