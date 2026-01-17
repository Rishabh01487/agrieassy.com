/**
 * ============================================
 * BILLING ROUTES
 * ============================================
 * /api/billing endpoints
 * Invoice creation, payment tracking
 */

const express = require('express');
const router = express.Router();

const billingController = require('../controllers/billingController');
const { authMiddleware, buyersOnly, farmersOnly } = require('../middleware/authMiddleware');

/**
 * PROTECTED ROUTES - BUYERS ONLY
 */

/**
 * POST /api/billing/create
 * Create invoice after delivery
 */
router.post('/create', authMiddleware, buyersOnly, billingController.createBilling);

/**
 * GET /api/billing/:billingId
 * Get billing details
 */
router.get('/:billingId', authMiddleware, billingController.getBillingDetails);

/**
 * PUT /api/billing/:billingId/payment
 * Record payment
 */
router.put('/:billingId/payment', authMiddleware, buyersOnly, billingController.updatePaymentStatus);

/**
 * GET /api/billing/buyer/list
 * Get buyer's billings
 */
router.get('/buyer/list', authMiddleware, buyersOnly, billingController.getBuyerBillings);

/**
 * GET /api/billing/farmer/list
 * Get farmer's billings
 */
router.get('/farmer/list', authMiddleware, farmersOnly, billingController.getFarmerBillings);

module.exports = router;
