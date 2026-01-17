/**
 * ============================================
 * TRANSACTION ROUTES
 * ============================================
 * /api/transaction endpoints
 * Offers, negotiations, vehicle allocation
 */

const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactionController');
const { authMiddleware, farmersOnly, buyersOnly } = require('../middleware/authMiddleware');

/**
 * PROTECTED ROUTES
 */

/**
 * GET /api/transaction/offers
 * Get farmer's offers
 */
router.get('/offers', authMiddleware, farmersOnly, transactionController.getFarmerOffers);

/**
 * POST /api/transaction/:transactionId/accept
 * Farmer accepts offer
 */
router.post('/:transactionId/accept', authMiddleware, farmersOnly, transactionController.acceptOffer);

/**
 * POST /api/transaction/:transactionId/reject
 * Farmer rejects offer
 */
router.post('/:transactionId/reject', authMiddleware, farmersOnly, transactionController.rejectOffer);

/**
 * POST /api/transaction/:transactionId/request-vehicle
 * Request vehicle for transport
 */
router.post('/:transactionId/request-vehicle', authMiddleware, farmersOnly, transactionController.requestVehicle);

/**
 * GET /api/transaction/:transactionId/available-vehicles
 * Get available vehicles for transaction
 */
router.get('/:transactionId/available-vehicles', authMiddleware, farmersOnly, transactionController.getAvailableVehicles);

module.exports = router;
