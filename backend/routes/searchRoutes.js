/**
 * ============================================
 * SEARCH ROUTES
 * ============================================
 * /api/search endpoints
 * Unified search across all resources
 */

const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middleware/authMiddleware');
const commodityController = require('../controllers/commodityController');
const vehicleController = require('../controllers/vehicleController');

/**
 * PUBLIC ROUTES
 */

/**
 * GET /api/search/commodities
 * Search for commodities
 */
router.get('/commodities', commodityController.searchCommodities);

/**
 * GET /api/search/vehicles
 * Search for vehicles
 */
router.get('/vehicles', vehicleController.searchVehicles);

/**
 * GET /api/search/buyers
 * Search for buyers (farmers searching buyers)
 */
router.get('/buyers', (req, res) => {
  // TODO: Implement buyer search
  res.json({ message: 'Search buyers' });
});

/**
 * GET /api/search/farmers
 * Search for farmers (buyers searching farmers)
 */
router.get('/farmers', (req, res) => {
  // TODO: Implement farmer search
  res.json({ message: 'Search farmers' });
});

module.exports = router;
