/**
 * ============================================
 * FARMER ROUTES
 * ============================================
 * /api/farmer endpoints
 * Farmer profile, listings, earnings
 */

const express = require('express');
const router = express.Router();

const farmerController = require('../controllers/farmerController');
const { authMiddleware, farmersOnly } = require('../middleware/authMiddleware');

/**
 * PROTECTED ROUTES - FARMERS ONLY
 */

/**
 * GET /api/farmer/profile
 * Get farmer profile
 */
router.get('/profile', authMiddleware, farmersOnly, farmerController.getFarmerProfile);

/**
 * PUT /api/farmer/profile
 * Update farmer profile
 */
router.put('/profile', authMiddleware, farmersOnly, farmerController.updateFarmerProfile);

/**
 * GET /api/farmer/listings
 * Get farmer's commodity listings
 */
router.get('/listings', authMiddleware, farmersOnly, farmerController.getFarmerListings);

/**
 * GET /api/farmer/transactions
 * Get farmer's transactions
 */
router.get('/transactions', authMiddleware, farmersOnly, farmerController.getFarmerTransactions);

/**
 * GET /api/farmer/earnings
 * Get farmer's earnings statistics
 */
router.get('/earnings', authMiddleware, farmersOnly, farmerController.getFarmerEarnings);

module.exports = router;
