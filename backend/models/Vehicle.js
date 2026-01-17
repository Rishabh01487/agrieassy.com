/**
 * ============================================
 * VEHICLE MODEL
 * ============================================
 * Represents vehicles registered by transporters
 * Includes vehicle specs, capacity, pricing, availability
 */

const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  // Vehicle Owner/Transporter
  transporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transporter',
    required: true,
    index: true
  },

  // Vehicle Type
  vehicleType: {
    type: String,
    enum: [
      'Two Wheeler',
      'Three Wheeler Auto',
      'Mini Truck (1-2 Ton)',
      'Small Truck (2-5 Ton)',
      'Medium Truck (5-10 Ton)',
      'Heavy Truck (10+ Ton)',
      'Refrigerated Truck',
      'Container'
    ],
    required: [true, 'Vehicle type is required'],
    index: true
  },

  // Vehicle Details
  vehicleRegistration: {
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      match: [/^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$/, 'Please provide a valid vehicle registration number']
    },
    registrationDate: Date,
    expiryDate: Date,
    state: String
  },

  // Manufacturer Details
  manufacturer: {
    brand: String,
    model: String,
    yearOfManufacture: Number,
    color: String
  },

  // Vehicle Capacity
  capacity: {
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ['kg', 'quintal', 'ton'],
        default: 'ton'
      }
    },
    volume: {
      value: Number,
      unit: {
        type: String,
        enum: ['cubic_meter', 'cubic_feet'],
        default: 'cubic_meter'
      }
    },
    pallets: Number
  },

  // Condition & Features
  condition: {
    type: String,
    enum: ['Excellent', 'Good', 'Fair'],
    default: 'Good'
  },

  features: {
    hasGPS: {
      type: Boolean,
      default: false
    },
    hasTemperatureControl: {
      type: Boolean,
      default: false
    },
    isRefrigerated: {
      type: Boolean,
      default: false
    },
    hasCovering: {
      type: Boolean,
      default: false
    },
    hasLighting: {
      type: Boolean,
      default: false
    }
  },

  // Documentation
  pollutionCertificate: {
    certificateNumber: String,
    expiryDate: Date,
    documentUrl: String
  },

  fitnessCertificate: {
    certificateNumber: String,
    expiryDate: Date,
    documentUrl: String
  },

  permitDetails: {
    permitNumber: String,
    permitType: String,
    expiryDate: Date,
    documentUrl: String
  },

  insuranceDetails: {
    policyNumber: String,
    providerName: String,
    expiryDate: Date,
    documentUrl: String
  },

  // Pricing
  pricePerKilometer: {
    amount: {
      type: Number,
      required: [true, 'Price per km is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },

  // Additional Charges
  additionalCharges: {
    loadingCharge: {
      amount: Number,
      included: Boolean
    },
    unloadingCharge: {
      amount: Number,
      included: Boolean
    },
    tollCharges: {
      applicableTill: String,
      type: {
        type: String,
        enum: ['Paid by Transporter', 'Paid by Customer']
      }
    }
  },

  // Service Area
  serviceArea: {
    states: [String],
    cities: [String],
    maxDistance: {
      value: Number,
      unit: {
        type: String,
        enum: ['km', 'miles'],
        default: 'km'
      }
    }
  },

  // Availability
  isAvailable: {
    type: Boolean,
    default: true,
    index: true
  },

  currentLocation: {
    address: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    },
    lastUpdated: Date
  },

  // Vehicle Images
  images: [{
    url: String,
    publicId: String,
    type: {
      type: String,
      enum: ['exterior', 'interior', 'capacity', 'documents']
    }
  }],

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

  // Ratings
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },

  // Maintenance
  lastMaintenanceDate: Date,
  nextMaintenanceDate: Date,

  // Timestamps
  registeredAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Geospatial index
vehicleSchema.index({ 'currentLocation.location': '2dsphere' });

// Indexes for filtering
vehicleSchema.index({ transporterId: 1, isAvailable: 1 });
vehicleSchema.index({ vehicleType: 1, isAvailable: 1 });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
