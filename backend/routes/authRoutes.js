/**
 * ============================================
 * AUTH ROUTES
 * ============================================
 * /api/auth endpoints
 * Registration and login for all roles
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { 
  authMiddleware,
  farmersOnly,
  buyersOnly,
  transportersOnly
} = require('../middleware/authMiddleware');
const {
  validateFarmerRegistration,
  validateBuyerRegistration,
  validateTransporterRegistration,
  validateLogin
} = require('../middleware/validationMiddleware');

/**
 * PUBLIC ROUTES
 */

/**
 * POST /api/auth/register/farmer
 * Register new farmer
 */
router.post('/register/farmer', validateFarmerRegistration, authController.registerFarmer);

/**
 * POST /api/auth/register/buyer
 * Register new buyer
 */
router.post('/register/buyer', validateBuyerRegistration, authController.registerBuyer);

/**
 * POST /api/auth/register/transporter
 * Register new transporter
 */
router.post('/register/transporter', validateTransporterRegistration, authController.registerTransporter);

/**
 * POST /api/auth/login
 * Login for all roles
 */
router.post('/login', validateLogin, authController.login);

/**
 * PROTECTED ROUTES
 */

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
