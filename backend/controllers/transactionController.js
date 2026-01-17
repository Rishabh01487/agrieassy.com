/**
 * ============================================
 * TRANSACTION CONTROLLER
 * ============================================
 * Handles transaction management
 * Offers, negotiations, acceptance, vehicle allocation
 */

const Transaction = require('../models/Transaction');
const Vehicle = require('../models/Vehicle');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const Transporter = require('../models/Transporter');
const { sendSuccess, sendError } = require('../utils/responseUtils');

/**
 * GET FARMER'S OFFERS RECEIVED
 * Returns offers sent by buyers to farmer
 */
const getFarmerOffers = async (req, res) => {
  try {
    const { status = 'Offer Sent' } = req.query;

    const transactions = await Transaction.find({
      farmerId: req.user.userId,
      status
    })
      .populate('buyerId', 'shopName city rating')
      .populate('commodityListingId', 'commodityType')
      .sort({ createdAt: -1 })
      .lean();

    sendSuccess(res, 200, 'Offers retrieved', {
      transactions,
      count: transactions.length
    });
  } catch (error) {
    console.error('Get Farmer Offers Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * ACCEPT OFFER
 * Farmer accepts buyer's offer
 */
const acceptOffer = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction) {
      return sendError(res, 404, 'Transaction not found', 'NOT_FOUND');
    }

    if (transaction.farmerId.toString() !== req.user.userId) {
      return sendError(res, 403, 'Unauthorized', 'UNAUTHORIZED');
    }

    // Update transaction
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        status: 'Offer Accepted',
        offerAcceptedAt: new Date()
      },
      { new: true }
    );

    sendSuccess(res, 200, 'Offer accepted successfully', { transaction: updatedTransaction });
  } catch (error) {
    console.error('Accept Offer Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * REJECT OFFER
 * Farmer rejects buyer's offer
 */
const rejectOffer = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { reason } = req.body;

    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction) {
      return sendError(res, 404, 'Transaction not found', 'NOT_FOUND');
    }

    if (transaction.farmerId.toString() !== req.user.userId) {
      return sendError(res, 403, 'Unauthorized', 'UNAUTHORIZED');
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        status: 'Offer Rejected',
        cancellationReason: reason
      },
      { new: true }
    );

    sendSuccess(res, 200, 'Offer rejected', { transaction: updatedTransaction });
  } catch (error) {
    console.error('Reject Offer Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * REQUEST VEHICLE FOR TRANSPORT
 * After agreeing on commodity, farmer requests vehicle
 */
const requestVehicle = async (req, res) => {
  try {
    const { transactionId, vehicleId } = req.body;

    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction) {
      return sendError(res, 404, 'Transaction not found', 'NOT_FOUND');
    }

    if (transaction.farmerId.toString() !== req.user.userId) {
      return sendError(res, 403, 'Unauthorized', 'UNAUTHORIZED');
    }

    const vehicle = await Vehicle.findById(vehicleId).populate('transporterId');
    
    if (!vehicle) {
      return sendError(res, 404, 'Vehicle not found', 'NOT_FOUND');
    }

    if (!vehicle.isAvailable) {
      return sendError(res, 400, 'Vehicle not available', 'VEHICLE_UNAVAILABLE');
    }

    // Update transaction with vehicle details
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        vehicleId,
        transporterId: vehicle.transporterId._id,
        transportationCost: {
          amount: calculateTransportCost(
            transaction.agreedQuantity.value,
            vehicle.pricePerKilometer.amount
          ),
          currency: 'INR'
        },
        status: 'Vehicle Allocated',
        vehicleAllocatedAt: new Date()
      },
      { new: true }
    );

    sendSuccess(res, 200, 'Vehicle allocated successfully', { transaction: updatedTransaction });
  } catch (error) {
    console.error('Request Vehicle Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * GET AVAILABLE VEHICLES FOR ROUTE
 * Returns available vehicles for specific pickup and delivery locations
 */
const getAvailableVehicles = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction) {
      return sendError(res, 404, 'Transaction not found', 'NOT_FOUND');
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const vehicles = await Vehicle.find({
      isAvailable: true,
      'serviceArea.states': transaction.pickupLocation?.state
    })
      .populate('transporterId', 'firstName lastName phone city rating')
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Vehicle.countDocuments({
      isAvailable: true,
      'serviceArea.states': transaction.pickupLocation?.state
    });

    sendSuccess(res, 200, 'Available vehicles retrieved', {
      vehicles,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get Available Vehicles Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * Helper function to calculate transport cost
 */
const calculateTransportCost = (quantity, pricePerKm, distance = 50) => {
  return quantity * pricePerKm * (distance / 100); // Simplified calculation
};

module.exports = {
  getFarmerOffers,
  acceptOffer,
  rejectOffer,
  requestVehicle,
  getAvailableVehicles
};
