/**
 * ============================================
 * COMMODITY DETAIL PAGE
 * ============================================
 * Shows detailed commodity information
 * Displays farmer profile, pricing, offers, buyer interest
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { commodityService, transactionService } from '../services/apiService';
import { toast } from 'react-toastify';
import './DetailPages.css';

const CommodityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [commodity, setCommodity] = useState(null);
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerData, setOfferData] = useState({
    quantity: '',
    unit: '',
    pricePerUnit: '',
    paymentMethod: 'cash',
    paymentConditions: ''
  });

  useEffect(() => {
    loadCommodityDetails();
  }, [id]);

  const loadCommodityDetails = async () => {
    try {
      setLoading(true);
      const response = await commodityService.getDetails(id);
      const data = response.data.data;
      setCommodity(data.commodity);
      setFarmer(data.farmer);
    } catch (error) {
      toast.error('Failed to load commodity details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOffer = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to send offers');
      navigate('/login');
      return;
    }

    if (user.role !== 'buyer') {
      toast.error('Only buyers can send offers');
      return;
    }

    try {
      const response = await transactionService.sendOffer(commodity._id, {
        agreedQuantity: {
          value: parseFloat(offerData.quantity),
          unit: offerData.unit
        },
        totalPrice: parseFloat(offerData.pricePerUnit) * parseFloat(offerData.quantity),
        paymentMethod: offerData.paymentMethod,
        paymentConditions: offerData.paymentConditions
      });

      toast.success('Offer sent successfully!');
      setShowOfferForm(false);
      setOfferData({
        quantity: '',
        unit: '',
        pricePerUnit: '',
        paymentMethod: 'cash',
        paymentConditions: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send offer');
    }
  };

  if (loading) {
    return <div className="loading">Loading commodity details...</div>;
  }

  if (!commodity) {
    return <div className="error">Commodity not found</div>;
  }

  const discountedPrice = commodity.pricePerUnit.amount * (1 - (commodity.discount || 0) / 100);

  return (
    <div className="detail-page commodity-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-container">
        {/* Left Section - Main Info */}
        <div className="detail-main">
          <div className="commodity-header">
            <h1>{commodity.commodityType}</h1>
            <p className="variety">{commodity.varietySubtype}</p>
            <div className="quality-badge">{commodity.quality}</div>
          </div>

          {/* Pricing Section */}
          <div className="pricing-section">
            <div className="price-box">
              <label>Price per {commodity.pricePerUnit.unit}</label>
              <div className="price-display">
                <span className="current-price">₹{discountedPrice.toFixed(2)}</span>
                {commodity.discount > 0 && (
                  <span className="original-price">₹{commodity.pricePerUnit.amount}</span>
                )}
              </div>
              {commodity.discount > 0 && (
                <span className="discount-badge">{commodity.discount}% OFF</span>
              )}
            </div>

            <div className="availability-box">
              <label>Available Quantity</label>
              <p className="quantity-value">
                {commodity.availableQuantity.value} {commodity.availableQuantity.unit}
              </p>
              <label>Minimum Order</label>
              <p className="min-quantity">
                {commodity.minOrderQuantity.value} {commodity.minOrderQuantity.unit}
              </p>
            </div>
          </div>

          {/* Commodity Details */}
          <div className="details-grid">
            <div className="detail-item">
              <label>Commodity Type</label>
              <p>{commodity.commodityType}</p>
            </div>
            <div className="detail-item">
              <label>Quality Grade</label>
              <p>{commodity.quality}</p>
            </div>
            <div className="detail-item">
              <label>Pickup Location</label>
              <p>{commodity.pickupLocation.city}, {commodity.pickupLocation.state}</p>
            </div>
            <div className="detail-item">
              <label>Storage Conditions</label>
              <p>{commodity.storageConditions}</p>
            </div>
            <div className="detail-item">
              <label>Shelf Life</label>
              <p>{commodity.shelfLife} days</p>
            </div>
            <div className="detail-item">
              <label>Payment Conditions</label>
              <p>{commodity.paymentConditions.join(', ')}</p>
            </div>
          </div>

          {/* Description */}
          <div className="description-section">
            <h3>About This Listing</h3>
            <p>{commodity.description || 'No additional details provided'}</p>
          </div>

          {/* Stats */}
          <div className="stats-section">
            <div className="stat">
              <span className="stat-label">Views</span>
              <span className="stat-value">{commodity.views || 0}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Interested Buyers</span>
              <span className="stat-value">{commodity.interestedCount || 0}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Listed Since</span>
              <span className="stat-value">{new Date(commodity.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Right Section - Farmer & Action */}
        <div className="detail-sidebar">
          {/* Farmer Card */}
          <div className="farmer-card">
            <h3>Farmer Details</h3>
            <div className="farmer-info">
              <div className="farmer-name">
                {farmer?.firstName} {farmer?.lastName}
              </div>
              <div className="farm-name">{farmer?.farmName}</div>
              
              <div className="farmer-details-list">
                <div className="detail">
                  <span>📍 Location</span>
                  <p>{farmer?.city}, {farmer?.state}</p>
                </div>
                <div className="detail">
                  <span>📞 Contact</span>
                  <p>{farmer?.phone}</p>
                </div>
                <div className="detail">
                  <span>🏡 Land Area</span>
                  <p>{farmer?.landArea} acres</p>
                </div>
                <div className="detail">
                  <span>🌾 Farming Type</span>
                  <p>{farmer?.farmingType?.join(', ')}</p>
                </div>
                <div className="detail">
                  <span>⭐ Rating</span>
                  <p>{farmer?.rating || 'No ratings yet'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {user?.role === 'buyer' ? (
            <div className="action-section">
              {!showOfferForm ? (
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowOfferForm(true)}
                >
                  📬 Send Offer
                </button>
              ) : (
                <form onSubmit={handleSendOffer} className="offer-form">
                  <h4>Send Offer</h4>
                  
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      step="0.01"
                      value={offerData.quantity}
                      onChange={(e) => setOfferData({...offerData, quantity: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Unit</label>
                    <select
                      value={offerData.unit}
                      onChange={(e) => setOfferData({...offerData, unit: e.target.value})}
                      required
                    >
                      <option value="">Select Unit</option>
                      <option value={commodity.availableQuantity.unit}>
                        {commodity.availableQuantity.unit}
                      </option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Price per {commodity.pricePerUnit.unit}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={offerData.pricePerUnit}
                      onChange={(e) => setOfferData({...offerData, pricePerUnit: e.target.value})}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      value={offerData.paymentMethod}
                      onChange={(e) => setOfferData({...offerData, paymentMethod: e.target.value})}
                    >
                      <option value="cash">Cash</option>
                      <option value="cheque">Cheque</option>
                      <option value="upi">UPI</option>
                      <option value="bank">Bank Transfer</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Additional Notes</label>
                    <textarea
                      value={offerData.paymentConditions}
                      onChange={(e) => setOfferData({...offerData, paymentConditions: e.target.value})}
                      placeholder="Add any special conditions..."
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="btn btn-success">Send Offer</button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowOfferForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="info-box">
              <p>Login as a buyer to send offers to this farmer</p>
              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                Login as Buyer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommodityDetailPage;
