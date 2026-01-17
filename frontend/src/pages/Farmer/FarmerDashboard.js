/**
 * ============================================
 * FARMER DASHBOARD
 * ============================================
 * Main dashboard for farmers
 * List commodities, view offers, track earnings
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { farmerService, transactionService } from '../../services/apiService';
import { toast } from 'react-toastify';
import FarmerOffersPage from './FarmerOffersPage';
import './FarmerDashboard.css';

const FarmerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [earnings, setEarnings] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load farmer profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Update active tab based on location
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('offers')) setActiveTab('offers');
    else if (path.includes('listings')) setActiveTab('listings');
    else if (path.includes('transactions')) setActiveTab('transactions');
    else if (path.includes('profile')) setActiveTab('profile');
    else setActiveTab('overview');
  }, [location]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await farmerService.getProfile();
      setProfile(response.data.data.farmer);

      // Load earnings and listings
      const [earningsRes, listingsRes, offersRes] = await Promise.all([
        farmerService.getEarnings(),
        farmerService.getListings(),
        transactionService.getFarmerOffers()
      ]);

      setEarnings(earningsRes.data.data);
      setListings(listingsRes.data.data.listings || []);
      setOffers(offersRes.data.data.offers || []);
    } catch (error) {
      toast.error('Failed to load profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="farmer-dashboard">
      {/* Sidebar Navigation */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>🚜 Farmer Portal</h2>
          <p>{profile?.farmName}</p>
        </div>

        <nav className="sidebar-nav">
          <Link
            to="/farmer"
            onClick={() => setActiveTab('overview')}
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          >
            📊 Overview
          </Link>
          <Link
            to="/farmer/listings"
            onClick={() => setActiveTab('listings')}
            className={`nav-item ${activeTab === 'listings' ? 'active' : ''}`}
          >
            📦 My Listings
          </Link>
          <Link
            to="/farmer/offers"
            onClick={() => setActiveTab('offers')}
            className={`nav-item ${activeTab === 'offers' ? 'active' : ''}`}
          >
            📬 Offers Received
            {offers.length > 0 && <span className="badge">{offers.length}</span>}
          </Link>
          <Link
            to="/farmer/transactions"
            onClick={() => setActiveTab('transactions')}
            className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
          >
            🔄 Transactions
          </Link>
          <Link
            to="/farmer/profile"
            onClick={() => setActiveTab('profile')}
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          >
            👤 Profile
          </Link>
          <Link
            to="/search/commodities"
            className="nav-item"
          >
            🔍 Search Buyers
          </Link>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome, {user?.firstName} {user?.lastName}</h1>
          <div className="header-actions">
            <Link to="/farmer/new-listing" className="btn btn-primary">
              + Add New Listing
            </Link>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeTab === 'overview' && (
          <div className="dashboard-content">
            <h2>Overview</h2>

            {/* Stats Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <h3>Active Listings</h3>
                  <p className="stat-value">{earnings?.totalListings || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Completed Deals</h3>
                  <p className="stat-value">{earnings?.completedDeals || 0}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h3>Total Earnings</h3>
                  <p className="stat-value">₹{earnings?.totalEarnings?.toLocaleString()}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📈</div>
                <div className="stat-content">
                  <h3>Avg per Deal</h3>
                  <p className="stat-value">₹{earnings?.averageEarningsPerDeal?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Recent Listings */}
            <div className="recent-section">
              <h3>Recent Listings</h3>
              {listings.length === 0 ? (
                <p className="empty-message">No listings yet. <Link to="/farmer/new-listing">Create your first listing</Link></p>
              ) : (
                listings.slice(0, 5).map((listing) => (
                  <div key={listing._id} className="listing-item">
                    <div className="listing-info">
                      <h4>{listing.commodityType} - {listing.varietySubtype}</h4>
                      <p>
                        {listing.availableQuantity.value} {listing.availableQuantity.unit} @
                        ₹{listing.pricePerUnit.amount}/{listing.pricePerUnit.unit}
                      </p>
                    </div>
                    <Link to={`/commodity/${listing._id}`} className="link-btn">View →</Link>
                  </div>
                ))
              )}
            </div>

            {/* Pending Offers */}
            {offers.length > 0 && (
              <div className="pending-offers-section">
                <h3>Pending Offers</h3>
                <p className="offer-count">You have {offers.filter(o => o.status === 'Offer Sent').length} new offers</p>
                <Link to="/farmer/offers" className="btn btn-secondary">View All Offers →</Link>
              </div>
            )}
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && <FarmerOffersPage />}

        {/* Other tabs content would go here */}
        {activeTab !== 'overview' && activeTab !== 'offers' && (
          <div className="dashboard-content">
            <h2>Coming Soon</h2>
            <p>This section is under development</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default FarmerDashboard;
