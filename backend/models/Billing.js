/**
 * ============================================
 * BILLING MODEL
 * ============================================
 * Represents the final billing/invoice for a transaction
 * Generated after goods are delivered and weighed
 */

const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  // Billing ID/Invoice Number
  invoiceNumber: {
    type: String,
    unique: true,
    required: true,
    index: true
  },

  // References
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    required: true,
    unique: true,
    index: true
  },

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
  commodityType: {
    type: String,
    required: true
  },

  varietySubtype: String,

  // Billing Quantity & Weight
  orderedQuantity: {
    value: Number,
    unit: String
  },

  actualWeightReceived: {
    value: {
      type: Number,
      required: [true, 'Actual weight must be recorded']
    },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'ton'],
      default: 'kg'
    }
  },

  weightDifference: {
    value: Number,
    unit: String,
    percentage: Number
  },

  // Rate & Billing Amount
  ratePerUnit: {
    amount: {
      type: Number,
      required: true
    },
    unit: String
  },

  // Pricing Breakdown
  subTotal: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },

  taxes: {
    sgst: {
      percentage: Number,
      amount: Number
    },
    cgst: {
      percentage: Number,
      amount: Number
    },
    igst: {
      percentage: Number,
      amount: Number
    },
    otherTaxes: [
      {
        name: String,
        percentage: Number,
        amount: Number
      }
    ]
  },

  totalTax: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },

  deductions: {
    damageDeduction: {
      amount: Number,
      reason: String
    },
    qualityDeduction: {
      amount: Number,
      reason: String
    },
    otherDeductions: [
      {
        description: String,
        amount: Number
      }
    ]
  },

  totalDeductions: {
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },

  // Final Amount
  totalAmount: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    }
  },

  // GST Details
  buyerGSTIN: String,
  farmerGSTIN: String,

  // Payment Terms
  paymentTerms: {
    dueDate: Date,
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Cheque', 'UPI', 'Bank Transfer']
    },
    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      bankName: String,
      ifscCode: String
    }
  },

  // Payment Status
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Partial', 'Paid', 'Overdue'],
    default: 'Unpaid',
    index: true
  },

  paidAmount: {
    type: Number,
    default: 0
  },

  paymentReceivedAt: Date,

  // Billing Details
  billedBy: {
    userId: mongoose.Schema.Types.ObjectId,
    name: String,
    designation: String,
    timestamp: Date
  },

  // Transportation Details (included in billing)
  transportationCost: {
    amount: Number,
    currency: {
      type: String,
      default: 'INR'
    }
  },

  driverName: String,
  vehicleNumber: String,
  transportDistance: {
    value: Number,
    unit: String
  },

  // Quality Inspection Notes
  qualityNotes: String,
  conditionOfDelivery: String,

  // Documents
  attachments: [
    {
      type: String,
      url: String,
      uploadedAt: Date
    }
  ],

  // Terms & Conditions
  termsAndConditions: String,

  // Notes
  additionalNotes: String,

  // Status
  isFinal: {
    type: Boolean,
    default: false
  },

  isPrinted: {
    type: Boolean,
    default: false
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

// Generate Invoice Number before saving
billingSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const count = await mongoose.model('Billing').countDocuments();
    this.invoiceNumber = `INV-${year}${month}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Auto-calculate totals
billingSchema.pre('save', function(next) {
  // Calculate total tax
  const taxes = this.taxes || {};
  let totalTax = 0;

  if (taxes.sgst) totalTax += taxes.sgst.amount || 0;
  if (taxes.cgst) totalTax += taxes.cgst.amount || 0;
  if (taxes.igst) totalTax += taxes.igst.amount || 0;
  if (taxes.otherTaxes) {
    taxes.otherTaxes.forEach(t => {
      totalTax += t.amount || 0;
    });
  }

  this.totalTax = { amount: totalTax, currency: 'INR' };

  // Calculate total deductions
  const deductions = this.deductions || {};
  let totalDeductions = 0;

  if (deductions.damageDeduction) totalDeductions += deductions.damageDeduction.amount || 0;
  if (deductions.qualityDeduction) totalDeductions += deductions.qualityDeduction.amount || 0;
  if (deductions.otherDeductions) {
    deductions.otherDeductions.forEach(d => {
      totalDeductions += d.amount || 0;
    });
  }

  this.totalDeductions = { amount: totalDeductions, currency: 'INR' };

  // Calculate final amount
  const subTotal = this.subTotal?.amount || 0;
  const taxAmount = this.totalTax?.amount || 0;
  const deductionAmount = this.totalDeductions?.amount || 0;
  const transport = this.transportationCost?.amount || 0;

  this.totalAmount = {
    amount: subTotal + taxAmount - deductionAmount + transport,
    currency: 'INR'
  };

  next();
});

const Billing = mongoose.model('Billing', billingSchema);

module.exports = Billing;
