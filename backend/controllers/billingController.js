/**
 * ============================================
 * BILLING CONTROLLER
 * ============================================
 * Handles billing and invoice generation
 * After goods delivery and weighing
 */

const Billing = require('../models/Billing');
const Transaction = require('../models/Transaction');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const { sendSuccess, sendError } = require('../utils/responseUtils');

/**
 * CREATE BILLING/INVOICE
 * Buyer creates billing after receiving goods
 */
const createBilling = async (req, res) => {
  try {
    const {
      transactionId,
      actualWeightReceived,
      ratePerUnit,
      taxes,
      deductions,
      termsAndConditions,
      notes,
      attachments
    } = req.body;

    // Get transaction details
    const transaction = await Transaction.findById(transactionId)
      .populate('farmerId', 'firstName lastName')
      .populate('buyerId', 'shopName gstin');

    if (!transaction) {
      return sendError(res, 404, 'Transaction not found', 'NOT_FOUND');
    }

    // Verify buyer is authenticated user
    if (transaction.buyerId._id.toString() !== req.user.userId) {
      return sendError(res, 403, 'Unauthorized', 'UNAUTHORIZED');
    }

    // Calculate weight difference
    const orderedQuantity = transaction.agreedQuantity.value;
    const weightDifference = actualWeightReceived - orderedQuantity;
    const weightDifferencePercentage = (weightDifference / orderedQuantity) * 100;

    // Calculate subtotal
    const subTotal = actualWeightReceived * ratePerUnit;

    // Create billing
    const billing = new Billing({
      transactionId,
      farmerId: transaction.farmerId._id,
      buyerId: transaction.buyerId._id,
      commodityType: transaction.commodityType,
      varietySubtype: transaction.varietySubtype,
      orderedQuantity: transaction.agreedQuantity,
      actualWeightReceived: {
        value: actualWeightReceived,
        unit: transaction.agreedQuantity.unit
      },
      weightDifference: {
        value: weightDifference,
        unit: transaction.agreedQuantity.unit,
        percentage: weightDifferencePercentage
      },
      ratePerUnit: {
        amount: ratePerUnit,
        unit: transaction.agreedQuantity.unit
      },
      subTotal: {
        amount: subTotal,
        currency: 'INR'
      },
      taxes,
      deductions,
      buyerGSTIN: transaction.buyerId.gstin,
      termsAndConditions,
      additionalNotes: notes,
      attachments,
      billedBy: {
        userId: req.user.userId,
        name: transaction.buyerId.shopName,
        timestamp: new Date()
      }
    });

    await billing.save();

    // Update transaction status
    await Transaction.findByIdAndUpdate(
      transactionId,
      {
        billingId: billing._id,
        status: 'Completed',
        completedAt: new Date()
      }
    );

    sendSuccess(res, 201, 'Invoice created successfully', { billing });
  } catch (error) {
    console.error('Create Billing Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * GET BILLING DETAILS
 */
const getBillingDetails = async (req, res) => {
  try {
    const { billingId } = req.params;

    const billing = await Billing.findById(billingId)
      .populate('farmerId', 'firstName lastName farmName')
      .populate('buyerId', 'shopName gstin')
      .populate('transactionId', 'vehicleNumber driverName');

    if (!billing) {
      return sendError(res, 404, 'Billing not found', 'NOT_FOUND');
    }

    // Check authorization
    if (
      billing.farmerId._id.toString() !== req.user.userId &&
      billing.buyerId._id.toString() !== req.user.userId
    ) {
      return sendError(res, 403, 'Unauthorized', 'UNAUTHORIZED');
    }

    sendSuccess(res, 200, 'Billing details retrieved', { billing });
  } catch (error) {
    console.error('Get Billing Details Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * UPDATE PAYMENT STATUS
 * Record payment received
 */
const updatePaymentStatus = async (req, res) => {
  try {
    const { billingId } = req.params;
    const { paymentMethod, paidAmount, paymentDate } = req.body;

    const billing = await Billing.findById(billingId);

    if (!billing) {
      return sendError(res, 404, 'Billing not found', 'NOT_FOUND');
    }

    // Verify authorization
    if (billing.buyerId.toString() !== req.user.userId) {
      return sendError(res, 403, 'Unauthorized', 'UNAUTHORIZED');
    }

    // Calculate new totals
    const newPaidAmount = (billing.paidAmount || 0) + paidAmount;
    const totalDue = billing.totalAmount.amount;
    let paymentStatus = 'Partial';

    if (newPaidAmount >= totalDue) {
      paymentStatus = 'Paid';
    }

    // Update billing
    const updatedBilling = await Billing.findByIdAndUpdate(
      billingId,
      {
        paymentMethod,
        paidAmount: newPaidAmount,
        paymentStatus,
        paymentReceivedAt: paymentDate,
        updatedAt: new Date()
      },
      { new: true }
    );

    sendSuccess(res, 200, 'Payment recorded successfully', { billing: updatedBilling });
  } catch (error) {
    console.error('Update Payment Status Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * GET BUYER BILLINGS
 */
const getBuyerBillings = async (req, res) => {
  try {
    const { status } = req.query;

    const query = { buyerId: req.user.userId };
    
    if (status) {
      query.paymentStatus = status;
    }

    const billings = await Billing.find(query)
      .populate('farmerId', 'farmName')
      .populate('transactionId', 'commodityType')
      .sort({ createdAt: -1 })
      .lean();

    sendSuccess(res, 200, 'Billings retrieved', {
      billings,
      count: billings.length
    });
  } catch (error) {
    console.error('Get Buyer Billings Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

/**
 * GET FARMER BILLINGS
 */
const getFarmerBillings = async (req, res) => {
  try {
    const { status } = req.query;

    const query = { farmerId: req.user.userId };
    
    if (status) {
      query.paymentStatus = status;
    }

    const billings = await Billing.find(query)
      .populate('buyerId', 'shopName')
      .populate('transactionId', 'commodityType')
      .sort({ createdAt: -1 })
      .lean();

    sendSuccess(res, 200, 'Billings retrieved', {
      billings,
      count: billings.length
    });
  } catch (error) {
    console.error('Get Farmer Billings Error:', error);
    sendError(res, 500, error.message, 'ERROR');
  }
};

module.exports = {
  createBilling,
  getBillingDetails,
  updatePaymentStatus,
  getBuyerBillings,
  getFarmerBillings
};
