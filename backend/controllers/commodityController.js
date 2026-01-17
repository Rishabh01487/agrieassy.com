/**
 * ============================================
 * COMMODITY CONTROLLER
 * ============================================
 * Handles commodity listing operations
 * Create, update, delete, filter commodities
 */

const CommodityListing = require('../models/CommodityListing');
const Farmer = require('../models/Farmer');
const { sendSuccess, sendError } = require('../utils/responseUtils');
const { generateGeoQuery } = require('../utils/locationUtils');

/**
 * CREATE COMMODITY LISTING
 * Farmer lists a new commodity for sale
 */
const createCommodityListing = async (req, res) => {
  try {
    const {
      commodityType, varietySubtype, description, quality,
      availableQuantity, minOrderQuantity, pricePerUnit,
      discount, paymentConditions, pickupLocation,
      storageConditions, perishable, shelfLife, images
    } = req.body;

    // Create listing
    const listing = new CommodityListing({
      farmerId: req.user.userId,
      commodityType,
      varietySubtype,
      description,
      quality,
      availableQuantity,
      minOrderQuantity,
      pricePerUnit,
      discount,
      paymentConditions,
      pickupLocation: {
        ...pickupLocation,
        location: {
          type: 'Point',
          coordinates: pickupLocation?.coordinates || [0, 0]
        }
      },
      storageConditions,
      perishable,
      shelfLife,
      images
    });

    await listing.save();

    // Update farmer's total listings
    await Farmer.findByIdAndUpdate(
      req.user.userId,
      { $inc: { totalListings: 1 } }
    );

    sendSuccess(res, 201, 'Commodity listed successfully', { listing });
  } catch (error) {
    console.error('Create Commodity Listing Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * UPDATE COMMODITY LISTING
 * Farmer updates commodity details or pricing
 */
const updateCommodityListing = async (req, res) => {
  try {
    const { listingId } = req.params;
    const updates = req.body;

    // Verify ownership
    const listing = await CommodityListing.findById(listingId);
    
    if (!listing) {
      return sendError(res, 404, 'Listing not found', 'NOT_FOUND');
    }

    if (listing.farmerId.toString() !== req.user.userId) {
      return sendError(res, 403, 'Unauthorized', 'UNAUTHORIZED');
    }

    // Update listing
    const updatedListing = await CommodityListing.findByIdAndUpdate(
      listingId,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    sendSuccess(res, 200, 'Commodity updated successfully', { listing: updatedListing });
  } catch (error) {
    console.error('Update Commodity Listing Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * DELIST COMMODITY
 * Farmer removes commodity from listing
 */
const delistCommodity = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await CommodityListing.findById(listingId);
    
    if (!listing) {
      return sendError(res, 404, 'Listing not found', 'NOT_FOUND');
    }

    if (listing.farmerId.toString() !== req.user.userId) {
      return sendError(res, 403, 'Unauthorized', 'UNAUTHORIZED');
    }

    // Delist
    const updatedListing = await CommodityListing.findByIdAndUpdate(
      listingId,
      {
        isActive: false,
        delisted: true,
        delistedAt: new Date()
      },
      { new: true }
    );

    sendSuccess(res, 200, 'Commodity delisted successfully', { listing: updatedListing });
  } catch (error) {
    console.error('Delist Commodity Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * SEARCH COMMODITIES
 * Search and filter commodities with various criteria
 */
const searchCommodities = async (req, res) => {
  try {
    const {
      commodityType,
      city,
      state,
      maxDistance = 50000,
      minPrice,
      maxPrice,
      quality,
      longitude,
      latitude,
      page = 1,
      limit = 20
    } = req.query;

    const query = { isActive: true, delisted: false };

    // Filter by commodity type
    if (commodityType) {
      query.commodityType = commodityType;
    }

    // Filter by location
    if (city) {
      query['pickupLocation.city'] = city;
    }

    if (state) {
      query['pickupLocation.state'] = state;
    }

    // Filter by geolocation
    if (longitude && latitude) {
      query['pickupLocation.location'] = generateGeoQuery(
        parseFloat(longitude),
        parseFloat(latitude),
        parseFloat(maxDistance)
      );
    }

    // Filter by price
    if (minPrice || maxPrice) {
      query['pricePerUnit.amount'] = {};
      if (minPrice) query['pricePerUnit.amount'].$gte = parseFloat(minPrice);
      if (maxPrice) query['pricePerUnit.amount'].$lte = parseFloat(maxPrice);
    }

    // Filter by quality
    if (quality) {
      query.quality = quality;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const listings = await CommodityListing.find(query)
      .populate('farmerId', 'farmName city state rating')
      .sort({ listedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await CommodityListing.countDocuments(query);

    sendSuccess(res, 200, 'Commodities retrieved', {
      listings,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Search Commodities Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * GET COMMODITY DETAILS
 * Get detailed information about a commodity
 */
const getCommodityDetails = async (req, res) => {
  try {
    const { listingId } = req.params;

    const listing = await CommodityListing.findByIdAndUpdate(
      listingId,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('farmerId', 'farmName city state phone rating');

    if (!listing) {
      return sendError(res, 404, 'Listing not found', 'NOT_FOUND');
    }

    sendSuccess(res, 200, 'Commodity details retrieved', { listing });
  } catch (error) {
    console.error('Get Commodity Details Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

module.exports = {
  createCommodityListing,
  updateCommodityListing,
  delistCommodity,
  searchCommodities,
  getCommodityDetails
};
