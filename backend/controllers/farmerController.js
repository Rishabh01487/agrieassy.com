/**
 * ============================================
 * FARMER CONTROLLER
 * ============================================
 * Handles farmer-specific operations
 * Commodity listings, profile, earnings, etc.
 */

const Farmer = require('../models/Farmer');
const CommodityListing = require('../models/CommodityListing');
const Transaction = require('../models/Transaction');
const { sendSuccess, sendError } = require('../utils/responseUtils');

/**
 * GET FARMER PROFILE
 * Returns farmer's profile with statistics
 */
const getFarmerProfile = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.user.userId)
      .populate('preferredBuyers.buyerId', 'shopName city')
      .populate('preferredTransporters.transporterId', 'firstName lastName city');

    if (!farmer) {
      return sendError(res, 404, 'Farmer not found', 'NOT_FOUND');
    }

    sendSuccess(res, 200, 'Farmer profile retrieved', { farmer });
  } catch (error) {
    console.error('Get Farmer Profile Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * UPDATE FARMER PROFILE
 * Updates farmer's personal and farm details
 */
const updateFarmerProfile = async (req, res) => {
  try {
    const { farmName, landArea, farmingType, bio, bankDetails } = req.body;

    const farmer = await Farmer.findByIdAndUpdate(
      req.user.userId,
      {
        farmName,
        landArea,
        farmingType,
        bio,
        bankDetails,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!farmer) {
      return sendError(res, 404, 'Farmer not found', 'NOT_FOUND');
    }

    sendSuccess(res, 200, 'Profile updated successfully', { farmer });
  } catch (error) {
    console.error('Update Farmer Profile Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * GET FARMER'S LISTINGS
 * Returns all commodities listed by farmer
 */
const getFarmerListings = async (req, res) => {
  try {
    const { status = 'active' } = req.query;

    const query = { farmerId: req.user.userId };
    
    if (status === 'active') {
      query.isActive = true;
      query.delisted = false;
    } else if (status === 'sold') {
      query.soldQuantity = { $gt: 0 };
    }

    const listings = await CommodityListing.find(query)
      .sort({ listedAt: -1 })
      .lean();

    sendSuccess(res, 200, 'Listings retrieved', { 
      listings,
      count: listings.length 
    });
  } catch (error) {
    console.error('Get Farmer Listings Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * GET FARMER'S TRANSACTIONS
 * Returns all transactions involving farmer
 */
const getFarmerTransactions = async (req, res) => {
  try {
    const { status } = req.query;

    const query = { farmerId: req.user.userId };
    
    if (status) {
      query.status = status;
    }

    const transactions = await Transaction.find(query)
      .populate('buyerId', 'shopName city')
      .populate('transporterId', 'firstName lastName')
      .sort({ createdAt: -1 })
      .lean();

    sendSuccess(res, 200, 'Transactions retrieved', { 
      transactions,
      count: transactions.length 
    });
  } catch (error) {
    console.error('Get Farmer Transactions Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * GET FARMER EARNINGS
 * Returns earnings statistics
 */
const getFarmerEarnings = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.user.userId);

    if (!farmer) {
      return sendError(res, 404, 'Farmer not found', 'NOT_FOUND');
    }

    // Get completed transactions
    const completedTransactions = await Transaction.find({
      farmerId: req.user.userId,
      status: 'Completed'
    }).lean();

    const totalEarnings = completedTransactions.reduce((sum, txn) => {
      return sum + (txn.totalPrice?.amount || 0);
    }, 0);

    const averageEarningsPerDeal = totalEarnings / completedTransactions.length || 0;

    sendSuccess(res, 200, 'Earnings retrieved', {
      totalEarnings,
      completedDeals: farmer.completedDeals,
      averageEarningsPerDeal,
      totalListings: farmer.totalListings
    });
  } catch (error) {
    console.error('Get Farmer Earnings Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

module.exports = {
  getFarmerProfile,
  updateFarmerProfile,
  getFarmerListings,
  getFarmerTransactions,
  getFarmerEarnings
};
