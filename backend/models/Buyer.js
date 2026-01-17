/**
 * ============================================
 * BUYER MODEL
 * ============================================
 * Extended User model for buyers/retailers
 * Includes shop details, GSTIN, commodities buying, etc.
 */

const mongoose = require('mongoose');
const User = require('./User');

const buyerSchema = new mongoose.Schema({
  // Shop Information
  shopName: {
    type: String,
    required: [true, 'Shop name is required'],
    trim: true,
    index: true
  },

  businessType: {
    type: String,
    enum: [
      'Retail Shop',
      'Wholesale Market',
      'Processor',
      'Exporter',
      'Distributor',
      'Cooperative'
    ],
    required: [true, 'Business type is required']
  },

  // GST Registration
  gstin: {
    type: String,
    required: [true, 'GSTIN is required'],
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please provide a valid GSTIN'],
    unique: true
  },

  gstVerified: {
    type: Boolean,
    default: false
  },

  // License Details
  businessLicense: {
    licenseNumber: String,
    licenseType: String,
    issuedDate: Date,
    expiryDate: Date,
    documentUrl: String
  },

  // Payment Methods Accepted
  paymentMethods: {
    cash: {
      type: Boolean,
      default: true
    },
    cheque: {
      type: Boolean,
      default: false
    },
    upi: {
      type: Boolean,
      default: false
    },
    bankTransfer: {
      type: Boolean,
      default: false
    },
    upiId: String
  },

  // Bank Details for payments to farmers
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

  // Shop Hours
  shopHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },

  // Shop Photo
  shopPhoto: {
    url: String,
    publicId: String
  },

  // Statistics
  totalPurchases: {
    type: Number,
    default: 0
  },

  totalSpent: {
    type: Number,
    default: 0
  },

  // Commodities they buy
  commoditiesBuy: [{
    type: String,
    enum: [
      'Rice',
      'Wheat',
      'Corn',
      'Sugarcane',
      'Cotton',
      'Tomato',
      'Onion',
      'Potato',
      'Carrot',
      'Cabbage',
      'Brinjal',
      'Chilli',
      'Turmeric',
      'Coriander',
      'Cumin',
      'Milk',
      'Eggs',
      'Chicken',
      'Mutton',
      'Fish',
      'Other'
    ]
  }],

  preferredFarmers: [{
    farmerId: mongoose.Schema.Types.ObjectId,
    transactionCount: Number
  }]
});

// Create Buyer model by discriminating User
const Buyer = User.discriminator('buyer', buyerSchema);

module.exports = Buyer;
