/**
 * ============================================
 * VEHICLE ROUTES
 * ============================================
 * /api/vehicle endpoints
 * Vehicle registration, search, management
 */

const express = require('express');
const router = express.Router();

const vehicleController = require('../controllers/vehicleController');
const { authMiddleware, transportersOnly } = require('../middleware/authMiddleware');
const { validateVehicleRegistration } = require('../middleware/validationMiddleware');

/**
 * PUBLIC ROUTES
 */

/**
 * GET /api/vehicle/search
 * Search vehicles with filters
 */
router.get('/search', vehicleController.searchVehicles);

/**
 * GET /api/vehicle/:vehicleId
 * Get vehicle details
 */
router.get('/:vehicleId', vehicleController.getVehicleDetails);

/**
 * PROTECTED ROUTES - TRANSPORTERS ONLY
 */

/**
 * POST /api/vehicle/register
 * Register new vehicle
 */
router.post('/register', authMiddleware, transportersOnly, validateVehicleRegistration, vehicleController.registerVehicle);

/**
 * GET /api/vehicle/my-vehicles
 * Get transporter's vehicles
 */
router.get('/my-vehicles/list', authMiddleware, transportersOnly, vehicleController.getTransporterVehicles);

/**
 * PUT /api/vehicle/:vehicleId
 * Update vehicle details
 */
router.put('/:vehicleId', authMiddleware, transportersOnly, vehicleController.updateVehicle);

/**
 * PATCH /api/vehicle/:vehicleId/availability
 * Update vehicle availability
 */
router.patch('/:vehicleId/availability', authMiddleware, transportersOnly, vehicleController.updateVehicleAvailability);

module.exports = router;
