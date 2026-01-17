/**
 * ============================================
 * TRANSPORTER MODEL
 * ============================================
 * Extended User model for transporters/vehicle owners/drivers
 * Includes vehicle details, pricing, availability, etc.
 */

const mongoose = require('mongoose');
const User = require('./User');

const transporterSchema = new mongoose.Schema({
  // Transporter Type
  transporterType: {
    type: String,
    enum: ['Vehicle Owner', 'Driver', 'Transport Company'],
    required: [true, 'Transporter type is required']
  },

  // Company Information (for transport companies)
  companyName: {
    type: String,
    trim: true
  },

  companyRegistration: {
    registrationNumber: String,
    registrationType: String, // FSSAI, RTO, etc.
    documentUrl: String
  },

  // Driver License Information (for drivers)
  licenseNumber: {
    type: String,
    match: [/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{7}$/, 'Please provide a valid driving license number'],
    unique: true,
    sparse: true
  },

  licenseExpiryDate: Date,

  licenseVerified: {
    type: Boolean,
    default: false
  },

  // Insurance Details
  insuranceDetails: {
    policyNumber: String,
    providerName: String,
    expiryDate: Date,
    documentUrl: String
  },

  // Bank Details
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

  // Statistics
  totalTrips: {
    type: Number,
    default: 0
  },

  completedTrips: {
    type: Number,
    default: 0
  },

  totalEarnings: {
    type: Number,
    default: 0
  },

  vehicleIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }],

  // Operating regions
  operatingRegions: {
    type: [String],
    required: [true, 'Operating regions must be specified']
  },

  // Availability
  isAvailable: {
    type: Boolean,
    default: true
  }
});

// Create Transporter model by discriminating User
const Transporter = User.discriminator('transporter', transporterSchema);

module.exports = Transporter;
