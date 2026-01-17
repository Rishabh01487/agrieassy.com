/**
 * ============================================
 * BILLING/INVOICE PAGE
 * ============================================
 * View and manage invoices and payments
 * Track billing status and payment records
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { billingService } from '../services/apiService';
import { toast } from 'react-toastify';
import './BillingPage.css';

const BillingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [billings, setBillings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    referenceNumber: '',
    notes: ''
  });

  useEffect(() => {
    loadBillings();
  }, [filterStatus, user?.role]);

  const loadBillings = async () => {
    try {
      setLoading(true);
      let response;
      
      if (user?.role === 'buyer') {
        response = await billingService.getBuyerBillings();
      } else if (user?.role === 'farmer') {
        response = await billingService.getFarmerBillings();
      }
      
      let bills = response?.data?.data?.billings || [];
      
      if (filterStatus !== 'all') {
        bills = bills.filter(b => b.paymentStatus === filterStatus);
      }
      
      setBillings(bills);
    } catch (error) {
      toast.error('Failed to load billings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    
    if (!paymentData.amount) {
      toast.error('Please enter payment amount');
      return;
    }

    try {
      await billingService.updatePaymentStatus(selectedBilling._id, {
        amount: parseFloat(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        paymentDate: paymentData.paymentDate,
        referenceNumber: paymentData.referenceNumber,
        notes: paymentData.notes
      });

      toast.success('Payment recorded successfully!');
      loadBillings();
      setShowPaymentForm(false);
      setShowDetails(false);
      setPaymentData({
        amount: '',
        paymentMethod: 'cash',
        paymentDate: new Date().toISOString().split('T')[0],
        referenceNumber: '',
        notes: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record payment');
    }
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      'Unpaid': '#dc3545',
      'Partial': '#ffc107',
      'Paid': '#28a745'
    };
    return colors[status] || '#6c757d';
  };

  const calculateRemainingAmount = (billing) => {
    const paid = billing.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    return billing.totalAmount - paid;
  };

  return (
    <div className="billing-page">
      <div className="billing-header">
        <h2>📋 {user?.role === 'buyer' ? 'My Invoices' : 'Invoices Sent'}</h2>
        <div className="billing-stats">
          <div className="stat-item">
            <span className="stat-number">{billings.length}</span>
            <span className="stat-label">Total Invoices</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              ₹{billings.reduce((sum, b) => sum + (b.totalAmount || 0), 0).toLocaleString()}
            </span>
            <span className="stat-label">Total Amount</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {billings.filter(b => b.paymentStatus === 'Paid').length}
            </span>
            <span className="stat-label">Paid</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {['all', 'Unpaid', 'Partial', 'Paid'].map(status => (
          <button
            key={status}
            className={`tab ${filterStatus === status ? 'active' : ''}`}
            onClick={() => setFilterStatus(status)}
          >
            {status === 'all' ? 'All Invoices' : status}
          </button>
        ))}
      </div>

      {/* Billings List */}
      <div className="billings-container">
        {loading ? (
          <div className="loading">Loading invoices...</div>
        ) : billings.length === 0 ? (
          <div className="empty-state">
            <p>📭 No invoices found</p>
            <p>Invoices will appear here once transactions are completed</p>
          </div>
        ) : (
          <div className="billings-grid">
            {billings.map((billing) => (
              <div
                key={billing._id}
                className="billing-card"
                onClick={() => {
                  setSelectedBilling(billing);
                  setShowDetails(true);
                }}
              >
                <div className="billing-header-card">
                  <div className="invoice-info">
                    <h4>Invoice #{billing.invoiceNumber}</h4>
                    <p className="commodity">
                      {billing.transaction?.commodityListing?.commodityType}
                    </p>
                  </div>
                  <div className="payment-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getPaymentStatusColor(billing.paymentStatus) }}
                    >
                      {billing.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="billing-details">
                  <div className="detail-row">
                    <span className="label">Total Amount</span>
                    <span className="value">
                      ₹{billing.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Paid</span>
                    <span className="value paid">
                      ₹{(billing.payments?.reduce((sum, p) => sum + p.amount, 0) || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Remaining</span>
                    <span className="value pending">
                      ₹{calculateRemainingAmount(billing).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="billing-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${((billing.payments?.reduce((sum, p) => sum + p.amount, 0) || 0) / billing.totalAmount) * 100}%`
                      }}
                    />
                  </div>
                  <span className="progress-text">
                    {Math.round(((billing.payments?.reduce((sum, p) => sum + p.amount, 0) || 0) / billing.totalAmount) * 100)}% Paid
                  </span>
                </div>

                <div className="billing-footer">
                  <span className="date">
                    {new Date(billing.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    className="view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBilling(billing);
                      setShowDetails(true);
                    }}
                  >
                    View Invoice →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Details Modal */}
      {showDetails && selectedBilling && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowDetails(false)}
            >
              ✕
            </button>

            <div className="invoice-header">
              <div>
                <h2>Invoice #{selectedBilling.invoiceNumber}</h2>
                <p className="invoice-date">
                  Date: {new Date(selectedBilling.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className="status-badge large"
                style={{ backgroundColor: getPaymentStatusColor(selectedBilling.paymentStatus) }}
              >
                {selectedBilling.paymentStatus}
              </span>
            </div>

            <div className="invoice-body">
              {/* Transaction Details */}
              <section className="section">
                <h4>Transaction Details</h4>
                <div className="details">
                  <div className="detail-row">
                    <span>Commodity</span>
                    <strong>
                      {selectedBilling.transaction?.commodityListing?.commodityType}
                    </strong>
                  </div>
                  <div className="detail-row">
                    <span>Quantity Delivered</span>
                    <strong>
                      {selectedBilling.actualWeightReceived} kg
                    </strong>
                  </div>
                  <div className="detail-row">
                    <span>Delivery Date</span>
                    <strong>
                      {new Date(selectedBilling.transaction?.createdAt).toLocaleDateString()}
                    </strong>
                  </div>
                </div>
              </section>

              {/* Billing Breakdown */}
              <section className="section">
                <h4>Amount Breakdown</h4>
                <div className="breakdown">
                  <div className="breakdown-row">
                    <span>Subtotal</span>
                    <span>₹{selectedBilling.subtotal?.toLocaleString()}</span>
                  </div>
                  
                  {selectedBilling.taxes && selectedBilling.taxes.length > 0 && (
                    <>
                      {selectedBilling.taxes.map((tax, idx) => (
                        <div key={idx} className="breakdown-row">
                          <span>{tax.type}</span>
                          <span>₹{tax.amount?.toLocaleString()}</span>
                        </div>
                      ))}
                    </>
                  )}

                  {selectedBilling.deductions > 0 && (
                    <div className="breakdown-row">
                      <span>Deductions</span>
                      <span>-₹{selectedBilling.deductions?.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="breakdown-row total">
                    <span>Total Amount</span>
                    <span>₹{selectedBilling.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </section>

              {/* Payment Information */}
              <section className="section">
                <h4>Payment Information</h4>
                <div className="payment-info">
                  <div className="payment-row">
                    <span className="label">Total Amount Due</span>
                    <span className="value">₹{selectedBilling.totalAmount?.toLocaleString()}</span>
                  </div>
                  <div className="payment-row">
                    <span className="label">Amount Paid</span>
                    <span className="value paid">
                      ₹{(selectedBilling.payments?.reduce((sum, p) => sum + p.amount, 0) || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="payment-row">
                    <span className="label">Amount Due</span>
                    <span className="value pending">
                      ₹{calculateRemainingAmount(selectedBilling).toLocaleString()}
                    </span>
                  </div>
                </div>
              </section>

              {/* Payment History */}
              {selectedBilling.payments && selectedBilling.payments.length > 0 && (
                <section className="section">
                  <h4>Payment History</h4>
                  <div className="payment-history">
                    {selectedBilling.payments.map((payment, idx) => (
                      <div key={idx} className="payment-item">
                        <div className="payment-left">
                          <span className="payment-method">{payment.paymentMethod}</span>
                          <span className="payment-date">
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="payment-amount">
                          ₹{payment.amount?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Terms */}
              {selectedBilling.termsAndConditions && (
                <section className="section">
                  <h4>Terms & Conditions</h4>
                  <p className="terms-text">{selectedBilling.termsAndConditions}</p>
                </section>
              )}
            </div>

            {/* Modal Actions */}
            <div className="invoice-footer">
              {user?.role === 'buyer' && selectedBilling.paymentStatus !== 'Paid' && (
                <>
                  {!showPaymentForm ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowPaymentForm(true)}
                    >
                      💳 Record Payment
                    </button>
                  ) : (
                    <form onSubmit={handleRecordPayment} className="payment-form">
                      <h5>Record Payment</h5>
                      
                      <div className="form-group">
                        <label>Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          max={calculateRemainingAmount(selectedBilling)}
                          value={paymentData.amount}
                          onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                          required
                        />
                        <small>Max: ₹{calculateRemainingAmount(selectedBilling).toLocaleString()}</small>
                      </div>

                      <div className="form-group">
                        <label>Payment Method</label>
                        <select
                          value={paymentData.paymentMethod}
                          onChange={(e) => setPaymentData({...paymentData, paymentMethod: e.target.value})}
                        >
                          <option value="cash">Cash</option>
                          <option value="cheque">Cheque</option>
                          <option value="upi">UPI</option>
                          <option value="bank">Bank Transfer</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Payment Date</label>
                        <input
                          type="date"
                          value={paymentData.paymentDate}
                          onChange={(e) => setPaymentData({...paymentData, paymentDate: e.target.value})}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Reference Number</label>
                        <input
                          type="text"
                          value={paymentData.referenceNumber}
                          onChange={(e) => setPaymentData({...paymentData, referenceNumber: e.target.value})}
                          placeholder="Cheque/Reference number"
                        />
                      </div>

                      <div className="form-group">
                        <label>Notes</label>
                        <textarea
                          value={paymentData.notes}
                          onChange={(e) => setPaymentData({...paymentData, notes: e.target.value})}
                          placeholder="Additional notes..."
                        />
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="btn btn-success">Save Payment</button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setShowPaymentForm(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}

              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowDetails(false);
                  setShowPaymentForm(false);
                }}
              >
                Close
              </button>

              <button
                className="btn btn-outline"
                onClick={() => window.print()}
              >
                🖨️ Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;
