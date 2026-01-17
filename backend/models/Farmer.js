/**
 * ============================================
 * FARMER MODEL
 * ============================================
 * Extended User model for farmers
 * Includes farm details, land area, commodities, etc.
 */

const mongoose = require('mongoose');
const User = require('./User');

const farmerSchema = new mongoose.Schema({
  // Farm Information
  farmName: {
    type: String,
    required: [true, 'Farm name is required'],
    trim: true
  },

  landArea: {
    value: {
      type: Number,
      required: [true, 'Land area is required']
    },
    unit: {
      type: String,
      enum: ['acres', 'hectares', 'bigha'],
      default: 'acres'
    }
  },

  farmingType: {
    type: [String],
    enum: [
      'Crop Production',
      'Livestock',
      'Dairy',
      'Poultry',
      'Fishery',
      'Horticulture',
      'Organic Farming',
      'Hydroponics'
    ],
    required: [true, 'Farming type is required']
  },

  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    accountType: {
      type: String,
      enum: ['Savings', 'Current']
    }
  },

  // Aadhar/ID Verification
  aadharNumber: {
    type: String,
    match: [/^[0-9]{12}$/, 'Please provide a valid 12-digit Aadhar number'],
    unique: true,
    sparse: true
  },

  aadharVerified: {
    type: Boolean,
    default: false
  },

  // Statistics
  totalListings: {
    type: Number,
    default: 0
  },

  completedDeals: {
    type: Number,
    default: 0
  },

  totalEarnings: {
    type: Number,
    default: 0
  },

  preferredBuyers: [{
    buyerId: mongoose.Schema.Types.ObjectId,
    transactionCount: Number
  }],

  preferredTransporters: [{
    transporterId: mongoose.Schema.Types.ObjectId,
    transactionCount: Number
  }]
});

// Create Farmer model by discriminating User
const Farmer = User.discriminator('farmer', farmerSchema);

module.exports = Farmer;
