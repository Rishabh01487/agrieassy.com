/**
 * ============================================
 * VALIDATION MIDDLEWARE
 * ============================================
 * Request validation using express-validator
 * Validates email, phone, password, etc.
 */

const { body, validationResult } = require('express-validator');

/**
 * Handle validation errors
 * Returns 400 if validation fails
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

/**
 * Farmer Registration Validation
 */
const validateFarmerRegistration = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pincode').matches(/^[0-9]{6}$/).withMessage('Valid 6-digit pincode is required'),
  body('farmName').trim().notEmpty().withMessage('Farm name is required'),
  body('landArea').isNumeric().withMessage('Land area must be a number'),
  body('farmingType').isArray({ min: 1 }).withMessage('At least one farming type must be selected'),
  handleValidationErrors
];

/**
 * Buyer Registration Validation
 */
const validateBuyerRegistration = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pincode').matches(/^[0-9]{6}$/).withMessage('Valid 6-digit pincode is required'),
  body('shopName').trim().notEmpty().withMessage('Shop name is required'),
  body('businessType').isIn(['Retail Shop', 'Wholesale Market', 'Processor', 'Exporter', 'Distributor', 'Cooperative'])
    .withMessage('Invalid business type'),
  body('gstin').matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)
    .withMessage('Valid GSTIN is required'),
  handleValidationErrors
];

/**
 * Transporter Registration Validation
 */
const validateTransporterRegistration = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pincode').matches(/^[0-9]{6}$/).withMessage('Valid 6-digit pincode is required'),
  body('transporterType').isIn(['Vehicle Owner', 'Driver', 'Transport Company'])
    .withMessage('Invalid transporter type'),
  body('operatingRegions').isArray({ min: 1 }).withMessage('At least one operating region is required'),
  handleValidationErrors
];

/**
 * Login Validation
 */
const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

/**
 * Commodity Listing Validation
 */
const validateCommodityListing = [
  body('commodityType').notEmpty().withMessage('Commodity type is required'),
  body('varietySubtype').trim().notEmpty().withMessage('Variety/subtype is required'),
  body('availableQuantity').isNumeric().withMessage('Available quantity must be a number'),
  body('pricePerUnit').isNumeric().withMessage('Price per unit must be a number'),
  body('city').trim().notEmpty().withMessage('City is required'),
  handleValidationErrors
];

/**
 * Vehicle Registration Validation
 */
const validateVehicleRegistration = [
  body('vehicleType').notEmpty().withMessage('Vehicle type is required'),
  body('vehicleRegistration.registrationNumber')
    .matches(/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/)
    .withMessage('Valid vehicle registration number is required'),
  body('capacity.weight.value').isNumeric().withMessage('Vehicle capacity must be a number'),
  body('pricePerKilometer').isNumeric().withMessage('Price per km must be a number'),
  body('serviceArea.states').isArray({ min: 1 }).withMessage('At least one state is required'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateFarmerRegistration,
  validateBuyerRegistration,
  validateTransporterRegistration,
  validateLogin,
  validateCommodityListing,
  validateVehicleRegistration
};
