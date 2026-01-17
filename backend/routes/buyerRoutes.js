/**
 * ============================================
 * BUYER ROUTES
 * ============================================
 * /api/buyer endpoints
 * Buyer profile, purchases, offers
 */

const express = require('express');
const router = express.Router();

const buyerController = require('../controllers/buyerController');
const { authMiddleware, buyersOnly } = require('../middleware/authMiddleware');

/**
 * PROTECTED ROUTES - BUYERS ONLY
 */

/**
 * GET /api/buyer/profile
 * Get buyer profile
 */
router.get('/profile', authMiddleware, buyersOnly, buyerController.getBuyerProfile);

/**
 * PUT /api/buyer/profile
 * Update buyer profile
 */
router.put('/profile', authMiddleware, buyersOnly, buyerController.updateBuyerProfile);

/**
 * GET /api/buyer/purchases
 * Get buyer's purchases
 */
router.get('/purchases', authMiddleware, buyersOnly, buyerController.getBuyerPurchases);

/**
 * POST /api/buyer/send-offer
 * Send offer to farmer
 */
router.post('/send-offer', authMiddleware, buyersOnly, buyerController.sendOfferToFarmer);

/**
 * GET /api/buyer/offers-received
 * Get offers received from farmers
 */
router.get('/offers-received', authMiddleware, buyersOnly, buyerController.getOffersReceived);

module.exports = router;
