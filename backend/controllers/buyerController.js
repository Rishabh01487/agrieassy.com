/**
 * ============================================
 * BUYER CONTROLLER
 * ============================================
 * Handles buyer-specific operations
 * Profile, purchases, inventory management
 */

const Buyer = require('../models/Buyer');
const Transaction = require('../models/Transaction');
const CommodityListing = require('../models/CommodityListing');
const { sendSuccess, sendError } = require('../utils/responseUtils');

/**
 * GET BUYER PROFILE
 * Returns buyer's shop details and statistics
 */
const getBuyerProfile = async (req, res) => {
  try {
    const buyer = await Buyer.findById(req.user.userId)
      .populate('preferredFarmers.farmerId', 'farmName city');

    if (!buyer) {
      return sendError(res, 404, 'Buyer not found', 'NOT_FOUND');
    }

    sendSuccess(res, 200, 'Buyer profile retrieved', { buyer });
  } catch (error) {
    console.error('Get Buyer Profile Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * UPDATE BUYER PROFILE
 * Updates shop details, payment methods, commodities
 */
const updateBuyerProfile = async (req, res) => {
  try {
    const {
      shopName, businessType, paymentMethods, 
      commoditiesBuy, shopHours, bio, bankDetails
    } = req.body;

    const buyer = await Buyer.findByIdAndUpdate(
      req.user.userId,
      {
        shopName,
        businessType,
        paymentMethods,
        commoditiesBuy,
        shopHours,
        bio,
        bankDetails,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!buyer) {
      return sendError(res, 404, 'Buyer not found', 'NOT_FOUND');
    }

    sendSuccess(res, 200, 'Profile updated successfully', { buyer });
  } catch (error) {
    console.error('Update Buyer Profile Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * GET BUYER PURCHASES
 * Returns all purchases made by buyer
 */
const getBuyerPurchases = async (req, res) => {
  try {
    const { status } = req.query;

    const query = { buyerId: req.user.userId };
    
    if (status) {
      query.status = status;
    }

    const purchases = await Transaction.find(query)
      .populate('farmerId', 'farmName city')
      .populate('commodityListingId', 'commodityType varietySubtype')
      .sort({ createdAt: -1 })
      .lean();

    sendSuccess(res, 200, 'Purchases retrieved', {
      purchases,
      count: purchases.length
    });
  } catch (error) {
    console.error('Get Buyer Purchases Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * SEND OFFER TO FARMER
 * Buyer sends offer to farmer for a commodity
 */
const sendOfferToFarmer = async (req, res) => {
  try {
    const {
      commodityListingId,
      quantity,
      proposedPrice,
      paymentMethod,
      notes
    } = req.body;

    // Verify commodity exists
    const listing = await CommodityListing.findById(commodityListingId);
    
    if (!listing) {
      return sendError(res, 404, 'Commodity not found', 'NOT_FOUND');
    }

    // Create transaction/offer
    const transaction = new Transaction({
      farmerId: listing.farmerId,
      buyerId: req.user.userId,
      commodityListingId,
      commodityType: listing.commodityType,
      varietySubtype: listing.varietySubtype,
      agreedQuantity: {
        value: quantity,
        unit: listing.availableQuantity.unit
      },
      pricePerUnit: {
        amount: proposedPrice,
        unit: listing.pricePerUnit.unit
      },
      totalPrice: {
        amount: quantity * proposedPrice,
        currency: 'INR'
      },
      paymentMethod,
      pickupLocation: listing.pickupLocation,
      status: 'Offer Sent',
      notes,
      offerSentAt: new Date()
    });

    await transaction.save();

    sendSuccess(res, 201, 'Offer sent successfully', { transaction });
  } catch (error) {
    console.error('Send Offer Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * GET OFFERS RECEIVED
 * Returns offers sent to this buyer by farmers
 */
const getOffersReceived = async (req, res) => {
  try {
    const { status = 'Offer Sent' } = req.query;

    const transactions = await Transaction.find({
      buyerId: req.user.userId,
      status
    })
      .populate('farmerId', 'farmName city rating')
      .populate('commodityListingId', 'commodityType pricePerUnit')
      .sort({ createdAt: -1 })
      .lean();

    sendSuccess(res, 200, 'Offers retrieved', {
      transactions,
      count: transactions.length
    });
  } catch (error) {
    console.error('Get Offers Received Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

module.exports = {
  getBuyerProfile,
  updateBuyerProfile,
  getBuyerPurchases,
  sendOfferToFarmer,
  getOffersReceived
};
