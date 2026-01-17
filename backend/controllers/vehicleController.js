/**
 * ============================================
 * VEHICLE CONTROLLER
 * ============================================
 * Handles vehicle registration and management
 * Vehicle search, pricing, availability
 */

const Vehicle = require('../models/Vehicle');
const Transporter = require('../models/Transporter');
const { sendSuccess, sendError } = require('../utils/responseUtils');
const { generateGeoQuery } = require('../utils/locationUtils');

/**
 * REGISTER VEHICLE
 * Transporter registers a new vehicle
 */
const registerVehicle = async (req, res) => {
  try {
    const {
      vehicleType, vehicleRegistration, manufacturer,
      capacity, condition, features, insuranceDetails,
      pricePerKilometer, additionalCharges, serviceArea, images
    } = req.body;

    // Create vehicle
    const vehicle = new Vehicle({
      transporterId: req.user.userId,
      vehicleType,
      vehicleRegistration,
      manufacturer,
      capacity,
      condition,
      features,
      insuranceDetails,
      pricePerKilometer,
      additionalCharges,
      serviceArea,
      images,
      isAvailable: true
    });

    await vehicle.save();

    // Add to transporter's vehicle list
    await Transporter.findByIdAndUpdate(
      req.user.userId,
      { $push: { vehicleIds: vehicle._id } }
    );

    sendSuccess(res, 201, 'Vehicle registered successfully', { vehicle });
  } catch (error) {
    console.error('Register Vehicle Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * GET TRANSPORTER VEHICLES
 * Returns all vehicles registered by transporter
 */
const getTransporterVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ transporterId: req.user.userId })
      .sort({ registeredAt: -1 });

    sendSuccess(res, 200, 'Vehicles retrieved', {
      vehicles,
      count: vehicles.length
    });
  } catch (error) {
    console.error('Get Transporter Vehicles Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * UPDATE VEHICLE
 * Update vehicle details or pricing
 */
const updateVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const updates = req.body;

    // Verify ownership
    const vehicle = await Vehicle.findById(vehicleId);
    
    if (!vehicle) {
      return sendError(res, 404, 'Vehicle not found', 'NOT_FOUND');
    }

    if (vehicle.transporterId.toString() !== req.user.userId) {
      return sendError(res, 403, 'Unauthorized', 'UNAUTHORIZED');
    }

    // Update vehicle
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    sendSuccess(res, 200, 'Vehicle updated successfully', { vehicle: updatedVehicle });
  } catch (error) {
    console.error('Update Vehicle Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * SEARCH VEHICLES
 * Search vehicles with filters
 */
const searchVehicles = async (req, res) => {
  try {
    const {
      vehicleType,
      fromCity,
      toCity,
      state,
      minCapacity,
      maxPrice,
      longitude,
      latitude,
      maxDistance = 50000,
      page = 1,
      limit = 20
    } = req.query;

    const query = { isAvailable: true };

    // Filter by vehicle type
    if (vehicleType) {
      query.vehicleType = vehicleType;
    }

    // Filter by location
    if (state) {
      query['serviceArea.states'] = state;
    }

    if (fromCity || toCity) {
      query['serviceArea.cities'] = { $in: [fromCity, toCity].filter(Boolean) };
    }

    // Filter by capacity
    if (minCapacity) {
      query['capacity.weight.value'] = { $gte: parseFloat(minCapacity) };
    }

    // Filter by price
    if (maxPrice) {
      query['pricePerKilometer.amount'] = { $lte: parseFloat(maxPrice) };
    }

    // Filter by geolocation
    if (longitude && latitude) {
      query['currentLocation.location'] = generateGeoQuery(
        parseFloat(longitude),
        parseFloat(latitude),
        parseFloat(maxDistance)
      );
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const vehicles = await Vehicle.find(query)
      .populate('transporterId', 'firstName lastName phone city rating')
      .sort({ rating: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Vehicle.countDocuments(query);

    sendSuccess(res, 200, 'Vehicles retrieved', {
      vehicles,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Search Vehicles Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * GET VEHICLE DETAILS
 */
const getVehicleDetails = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findById(vehicleId)
      .populate('transporterId', 'firstName lastName phone city rating');

    if (!vehicle) {
      return sendError(res, 404, 'Vehicle not found', 'NOT_FOUND');
    }

    sendSuccess(res, 200, 'Vehicle details retrieved', { vehicle });
  } catch (error) {
    console.error('Get Vehicle Details Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * UPDATE VEHICLE AVAILABILITY
 */
const updateVehicleAvailability = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const { isAvailable } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    
    if (!vehicle) {
      return sendError(res, 404, 'Vehicle not found', 'NOT_FOUND');
    }

    if (vehicle.transporterId.toString() !== req.user.userId) {
      return sendError(res, 403, 'Unauthorized', 'UNAUTHORIZED');
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      vehicleId,
      { isAvailable, updatedAt: new Date() },
      { new: true }
    );

    sendSuccess(res, 200, 'Availability updated', { vehicle: updatedVehicle });
  } catch (error) {
    console.error('Update Vehicle Availability Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

module.exports = {
  registerVehicle,
  getTransporterVehicles,
  updateVehicle,
  searchVehicles,
  getVehicleDetails,
  updateVehicleAvailability
};
