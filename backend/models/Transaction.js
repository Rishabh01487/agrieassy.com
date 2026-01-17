/**
 * ============================================
 * TRANSACTION MODEL
 * ============================================
 * Represents business transactions between farmers and buyers
 * Tracks offers, negotiations, acceptance, and fulfillment
 */

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Transaction ID (Reference)
  transactionId: {
    type: String,
    unique: true,
    required: true,
    index: true
  },

  // Parties Involved
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
    index: true
  },

  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Buyer',
    required: true,
    index: true
  },

  // Commodity Details
  commodityListingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CommodityListing',
    required: true
  },

  commodityType: String,
  varietySubtype: String,

  // Negotiated Quantity
  agreedQuantity: {
    value: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative']
    },
    unit: String
  },

  // Pricing
  pricePerUnit: {
    amount: Number,
    unit: String
  },

  totalPrice: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },

  // Payment Details
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Cheque', 'UPI', 'Bank Transfer', 'Pending'],
    default: 'Pending'
  },

  paymentStatus: {
    type: String,
    enum: ['Pending', 'Partial', 'Completed'],
    default: 'Pending',
    index: true
  },

  paidAmount: {
    type: Number,
    default: 0
  },

  remainingAmount: {
    type: Number,
    default: function() {
      return this.totalPrice.amount;
    }
  },

  paymentDueDate: Date,

  // Transportation
  vehicleId: mongoose.Schema.Types.ObjectId,
  transporterId: mongoose.Schema.Types.ObjectId,
  driverId: mongoose.Schema.Types.ObjectId,

  transportationCost: {
    amount: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },

  // Delivery/Pickup Details
  pickupLocation: {
    address: String,
    city: String,
    pincode: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    }
  },

  deliveryLocation: {
    address: String,
    city: String,
    pincode: String,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    }
  },

  estimatedDistance: {
    value: Number,
    unit: {
      type: String,
      enum: ['km', 'miles'],
      default: 'km'
    }
  },

  // Transaction Status
  status: {
    type: String,
    enum: [
      'Offer Sent',           // Initial offer from farmer
      'Offer Accepted',       // Buyer accepted offer
      'Offer Rejected',       // Buyer rejected
      'Negotiating',          // Price negotiation
      'Finalized',            // Both agreed on terms
      'Vehicle Allocated',    // Vehicle assigned for transport
      'In Transit',           // Goods in transit
      'Delivered',            // Goods delivered
      'Completed',            // Transaction completed
      'Cancelled'             // Transaction cancelled
    ],
    default: 'Offer Sent',
    index: true
  },

  // Timeline
  offerSentAt: Date,
  offerAcceptedAt: Date,
  vehicleAllocatedAt: Date,
  transportStartedAt: Date,
  deliveredAt: Date,
  completedAt: Date,

  // Billing Reference
  billingId: mongoose.Schema.Types.ObjectId,
  actualWeight: {
    value: Number,
    unit: String
  },

  // Quality Inspection
  qualityInspection: {
    conducted: {
      type: Boolean,
      default: false
    },
    inspectedBy: mongoose.Schema.Types.ObjectId,
    status: {
      type: String,
      enum: ['Passed', 'Failed', 'Pending'],
      default: 'Pending'
    },
    remarks: String,
    inspectedAt: Date
  },

  // Notes & Remarks
  notes: String,
  cancellationReason: String,

  // Dispute Resolution
  hasDispute: {
    type: Boolean,
    default: false
  },

  disputeDetails: {
    reason: String,
    reportedBy: String, // 'Farmer' or 'Buyer'
    reportedAt: Date,
    resolution: String,
    resolvedAt: Date
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Geospatial indexes
transactionSchema.index({ 'pickupLocation.location': '2dsphere' });
transactionSchema.index({ 'deliveryLocation.location': '2dsphere' });

// Indexes for efficient queries
transactionSchema.index({ farmerId: 1, status: 1 });
transactionSchema.index({ buyerId: 1, status: 1 });
transactionSchema.index({ createdAt: -1 });

// Generate Transaction ID before saving
transactionSchema.pre('save', async function(next) {
  if (!this.transactionId) {
    const count = await mongoose.model('Transaction').countDocuments();
    this.transactionId = `TXN-${Date.now()}-${count + 1}`;
  }
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
