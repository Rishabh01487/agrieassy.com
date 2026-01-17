/**
 * ============================================
 * COMMODITY LISTING MODEL
 * ============================================
 * Represents commodities listed by farmers for sale
 * Contains commodity details, pricing, quantity, etc.
 */

const mongoose = require('mongoose');

const commodityListingSchema = new mongoose.Schema({
  // Farmer Information
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
    index: true
  },

  // Commodity Details
  commodityType: {
    type: String,
    enum: [
      'Rice', 'Wheat', 'Corn', 'Sugarcane', 'Cotton',
      'Tomato', 'Onion', 'Potato', 'Carrot', 'Cabbage',
      'Brinjal', 'Chilli', 'Turmeric', 'Coriander', 'Cumin',
      'Milk', 'Eggs', 'Chicken', 'Mutton', 'Fish',
      'Apple', 'Mango', 'Banana', 'Orange', 'Grape',
      'Honey', 'Jaggery', 'Spices', 'Other'
    ],
    required: [true, 'Commodity type is required'],
    index: true
  },

  varietySubtype: {
    type: String,
    required: [true, 'Variety/subtype is required'],
    example: 'Basmati Rice, Red Onion, etc.'
  },

  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },

  quality: {
    type: String,
    enum: ['Premium', 'Grade A', 'Grade B', 'Standard'],
    default: 'Standard'
  },

  // Quantity Information
  availableQuantity: {
    value: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative']
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton', 'liter', 'unit', 'dozen', 'box'],
      required: true
    }
  },

  minOrderQuantity: {
    value: {
      type: Number,
      default: 1
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton', 'liter', 'unit', 'dozen', 'box'],
      required: true
    }
  },

  // Pricing
  pricePerUnit: {
    amount: {
      type: Number,
      required: [true, 'Price per unit is required'],
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'INR'
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton', 'liter', 'unit', 'dozen', 'box'],
      required: true
    }
  },

  // Discount
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  discountedPrice: {
    amount: Number,
    unit: String
  },

  // Payment Conditions
  paymentConditions: {
    acceptsCash: {
      type: Boolean,
      default: true
    },
    acceptsCheque: {
      type: Boolean,
      default: false
    },
    acceptsUPI: {
      type: Boolean,
      default: false
    },
    paymentTerms: {
      type: String,
      enum: ['Immediate', 'Credit 7 days', 'Credit 15 days', 'Credit 30 days'],
      default: 'Immediate'
    }
  },

  // Delivery Location
  pickupLocation: {
    address: String,
    city: {
      type: String,
      index: true
    },
    state: String,
    pincode: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number] // [longitude, latitude]
    }
  },

  // Storage & Handling
  storageConditions: {
    type: String,
    enum: ['Room Temperature', 'Refrigerated', 'Chilled', 'Frozen'],
    default: 'Room Temperature'
  },

  perishable: {
    type: Boolean,
    default: true
  },

  shelfLife: {
    value: Number,
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months', 'years']
    }
  },

  // Images
  images: [{
    url: String,
    publicId: String
  }],

  // Status
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },

  soldQuantity: {
    type: Number,
    default: 0
  },

  // Engagement metrics
  views: {
    type: Number,
    default: 0
  },

  interests: [{
    buyerId: mongoose.Schema.Types.ObjectId,
    interestedQuantity: Number,
    interestedAt: Date
  }],

  // Timestamps
  listedAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },

  delisted: {
    type: Boolean,
    default: false
  },

  delistedAt: Date
}, { timestamps: true });

// Geospatial index for location-based queries
commodityListingSchema.index({ 'pickupLocation.location': '2dsphere' });

// Indexes for efficient filtering
commodityListingSchema.index({ farmerId: 1, isActive: 1 });
commodityListingSchema.index({ commodityType: 1, isActive: 1 });
commodityListingSchema.index({ 'pickupLocation.city': 1, isActive: 1 });

// Calculate discounted price before saving
commodityListingSchema.pre('save', function(next) {
  if (this.discount && this.discount > 0) {
    const discountAmount = (this.pricePerUnit.amount * this.discount) / 100;
    this.discountedPrice = {
      amount: this.pricePerUnit.amount - discountAmount,
      unit: this.pricePerUnit.unit
    };
  }
  next();
});

const CommodityListing = mongoose.model('CommodityListing', commodityListingSchema);

module.exports = CommodityListing;
