/**
 * ============================================
 * BUYER DASHBOARD
 * ============================================
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { buyerService } from '../../services/apiService';
import { toast } from 'react-toastify';
import './BuyerDashboard.css';

const BuyerDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, purchasesRes] = await Promise.all([
        buyerService.getProfile(),
        buyerService.getPurchases()
      ]);

      setProfile(profileRes.data.data.buyer);
      setPurchases(purchasesRes.data.data.purchases);
    } catch (error) {
      toast.error('Failed to load profile');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buyer-dashboard">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>🏪 Buyer Portal</h2>
          <p>{profile?.shopName}</p>
        </div>

        <nav className="sidebar-nav">
          <a href="#overview" className="nav-item active">📊 Overview</a>
          <a href="#purchases" className="nav-item">🛍️ My Purchases</a>
          <a href="#search" className="nav-item">🔍 Search Commodities</a>
          <a href="#profile" className="nav-item">👤 Profile</a>
        </nav>

        <button className="logout-btn" onClick={() => logout()}>🚪 Logout</button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome, {user?.firstName}</h1>
        </header>

        <div className="dashboard-content">
          <h2>Buyer Dashboard</h2>
          <p>Shop: {profile?.shopName}</p>
          <p>Purchases: {purchases.length}</p>
        </div>
      </main>
    </div>
  );
};

export default BuyerDashboard;
