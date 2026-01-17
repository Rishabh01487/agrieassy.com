/**
 * ============================================
 * BUYER OFFERS PAGE
 * ============================================
 * View and manage offers sent to farmers
 * Track offer status and communications
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { transactionService } from '../services/apiService';
import { toast } from 'react-toastify';
import './BuyerOffers.css';

const BuyerOffersPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadOffers();
  }, [filterStatus]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      // This would call the backend to get buyer's sent offers
      // For now, we'll show a placeholder
      const response = await transactionService.getBuyerOffers?.();
      let offers = response?.data?.data?.offers || [];
      
      if (filterStatus !== 'all') {
        offers = offers.filter(o => o.status === filterStatus);
      }
      
      setOffers(offers);
    } catch (error) {
      // API endpoint might not exist yet, show demo
      setOffers([]);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOffer = async (offerId) => {
    if (!window.confirm('Are you sure you want to cancel this offer?')) return;
    
    try {
      await transactionService.cancelOffer?.(offerId);
      toast.success('Offer cancelled');
      loadOffers();
      setShowDetails(false);
    } catch (error) {
      toast.error('Failed to cancel offer');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': '#ffc107',
      'Accepted': '#28a745',
      'Rejected': '#dc3545',
      'Completed': '#17a2b8'
    };
    return colors[status] || '#6c757d';
  };

  return (
    <div className="buyer-offers-page">
      <div className="offers-header">
        <h2>💌 My Offers</h2>
        <div className="offers-stats">
          <div className="stat-item">
            <span className="stat-number">{offers.length}</span>
            <span className="stat-label">Total Offers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {offers.filter(o => o.status === 'Pending').length}
            </span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {offers.filter(o => o.status === 'Accepted').length}
            </span>
            <span className="stat-label">Accepted</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {['all', 'Pending', 'Accepted', 'Rejected', 'Completed'].map(status => (
          <button
            key={status}
            className={`tab ${filterStatus === status ? 'active' : ''}`}
            onClick={() => setFilterStatus(status)}
          >
            {status === 'all' ? 'All Offers' : status}
          </button>
        ))}
      </div>

      {/* Offers List */}
      <div className="offers-container">
        {loading ? (
          <div className="loading">Loading your offers...</div>
        ) : offers.length === 0 ? (
          <div className="empty-state">
            <p>💭 No offers sent yet</p>
            <p>Search for commodities and send offers to farmers!</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/search/commodities')}
            >
              🔍 Browse Commodities
            </button>
          </div>
        ) : (
          <div className="offers-grid">
            {offers.map((offer) => (
              <div
                key={offer._id}
                className="offer-card"
                onClick={() => {
                  setSelectedOffer(offer);
                  setShowDetails(true);
                }}
              >
                <div className="offer-header">
                  <div className="offer-commodity">
                    <h4>{offer.commodityListing?.commodityType}</h4>
                    <p className="farmer-name">From: {offer.farmer?.firstName} {offer.farmer?.lastName}</p>
                  </div>
                  <div className="offer-status">
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(offer.status) }}
                    >
                      {offer.status}
                    </span>
                  </div>
                </div>

                <div className="offer-details">
                  <div className="detail-row">
                    <span className="label">Quantity</span>
                    <span className="value">
                      {offer.agreedQuantity?.value} {offer.agreedQuantity?.unit}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Your Offer</span>
                    <span className="value price">
                      ₹{offer.totalPrice?.toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Payment</span>
                    <span className="value">
                      {offer.paymentMethod?.charAt(0).toUpperCase() + offer.paymentMethod?.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="offer-footer">
                  <span className="date">
                    {new Date(offer.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    className="view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOffer(offer);
                      setShowDetails(true);
                    }}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Offer Details Modal */}
      {showDetails && selectedOffer && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close"
              onClick={() => setShowDetails(false)}
            >
              ✕
            </button>

            <div className="modal-header">
              <h3>Offer Details</h3>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(selectedOffer.status) }}
              >
                {selectedOffer.status}
              </span>
            </div>

            <div className="modal-body">
              {/* Commodity Info */}
              <section className="section">
                <h4>📦 Commodity</h4>
                <div className="details">
                  <div className="detail">
                    <span>Type</span>
                    <strong>{selectedOffer.commodityListing?.commodityType}</strong>
                  </div>
                  <div className="detail">
                    <span>Variety</span>
                    <strong>{selectedOffer.commodityListing?.varietySubtype}</strong>
                  </div>
                  <div className="detail">
                    <span>Quality</span>
                    <strong>{selectedOffer.commodityListing?.quality}</strong>
                  </div>
                </div>
              </section>

              {/* Farmer Info */}
              <section className="section">
                <h4>🚜 Farmer Information</h4>
                <div className="details">
                  <div className="detail">
                    <span>Name</span>
                    <strong>
                      {selectedOffer.farmer?.firstName} {selectedOffer.farmer?.lastName}
                    </strong>
                  </div>
                  <div className="detail">
                    <span>Farm</span>
                    <strong>{selectedOffer.farmer?.farmName}</strong>
                  </div>
                  <div className="detail">
                    <span>Location</span>
                    <strong>
                      {selectedOffer.farmer?.city}, {selectedOffer.farmer?.state}
                    </strong>
                  </div>
                  <div className="detail">
                    <span>Phone</span>
                    <strong>{selectedOffer.farmer?.phone}</strong>
                  </div>
                  <div className="detail">
                    <span>Email</span>
                    <strong>{selectedOffer.farmer?.email}</strong>
                  </div>
                </div>
              </section>

              {/* Offer Details */}
              <section className="section">
                <h4>💰 Your Offer</h4>
                <div className="details">
                  <div className="detail">
                    <span>Quantity Requested</span>
                    <strong>
                      {selectedOffer.agreedQuantity?.value} {selectedOffer.agreedQuantity?.unit}
                    </strong>
                  </div>
                  <div className="detail">
                    <span>Your Price per Unit</span>
                    <strong>
                      ₹{selectedOffer.pricePerUnit?.amount}
                    </strong>
                  </div>
                  <div className="detail highlight">
                    <span>Total Amount</span>
                    <strong>₹{selectedOffer.totalPrice?.toLocaleString()}</strong>
                  </div>
                  <div className="detail">
                    <span>Payment Method</span>
                    <strong>
                      {selectedOffer.paymentMethod?.charAt(0).toUpperCase() +
                        selectedOffer.paymentMethod?.slice(1)}
                    </strong>
                  </div>
                </div>
              </section>

              {/* Your Notes */}
              {selectedOffer.paymentConditions && (
                <section className="section">
                  <h4>📝 Your Notes</h4>
                  <p className="terms-text">{selectedOffer.paymentConditions}</p>
                </section>
              )}

              {/* Timeline */}
              <section className="section">
                <h4>📅 Timeline</h4>
                <div className="timeline">
                  <div className="timeline-item">
                    <span className="timeline-date">
                      {new Date(selectedOffer.createdAt).toLocaleString()}
                    </span>
                    <span className="timeline-event">Offer sent</span>
                  </div>
                  {selectedOffer.status !== 'Pending' && (
                    <div className="timeline-item">
                      <span className="timeline-date">
                        {new Date(selectedOffer.updatedAt).toLocaleString()}
                      </span>
                      <span className="timeline-event">{selectedOffer.status}</span>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Modal Actions */}
            {selectedOffer.status === 'Pending' && (
              <div className="modal-actions">
                <button
                  className="btn btn-danger"
                  onClick={() => handleCancelOffer(selectedOffer._id)}
                >
                  ✕ Cancel Offer
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </button>
              </div>
            )}

            {selectedOffer.status === 'Accepted' && (
              <div className="modal-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    navigate('/buyer/transactions');
                    setShowDetails(false);
                  }}
                >
                  View Transaction
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </button>
              </div>
            )}

            {['Rejected', 'Completed'].includes(selectedOffer.status) && (
              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerOffersPage;
