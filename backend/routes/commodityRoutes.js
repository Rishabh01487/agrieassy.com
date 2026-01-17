/**
 * ============================================
 * COMMODITY ROUTES
 * ============================================
 * /api/commodity endpoints
 * List, update, delete, search commodities
 */

const express = require('express');
const router = express.Router();

const commodityController = require('../controllers/commodityController');
const { authMiddleware, farmersOnly } = require('../middleware/authMiddleware');
const { validateCommodityListing } = require('../middleware/validationMiddleware');

/**
 * PUBLIC ROUTES
 */

/**
 * GET /api/commodity/search
 * Search commodities with filters
 */
router.get('/search', commodityController.searchCommodities);

/**
 * GET /api/commodity/:listingId
 * Get commodity details
 */
router.get('/:listingId', commodityController.getCommodityDetails);

/**
 * PROTECTED ROUTES - FARMERS ONLY
 */

/**
 * POST /api/commodity/create
 * Create new commodity listing
 */
router.post('/create', authMiddleware, farmersOnly, validateCommodityListing, commodityController.createCommodityListing);

/**
 * PUT /api/commodity/:listingId
 * Update commodity listing
 */
router.put('/:listingId', authMiddleware, farmersOnly, commodityController.updateCommodityListing);

/**
 * DELETE /api/commodity/:listingId
 * Delist commodity
 */
router.delete('/:listingId', authMiddleware, farmersOnly, commodityController.delistCommodity);

module.exports = router;
