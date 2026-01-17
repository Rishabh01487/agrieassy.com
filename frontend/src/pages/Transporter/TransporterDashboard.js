/**
 * ============================================
 * TRANSPORTER DASHBOARD
 * ============================================
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import './TransporterDashboard.css';

const TransporterDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="transporter-dashboard">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>🚛 Transporter Portal</h2>
          <p>{user?.firstName}</p>
        </div>

        <nav className="sidebar-nav">
          <a href="#overview" className="nav-item active">📊 Overview</a>
          <a href="#vehicles" className="nav-item">🚗 My Vehicles</a>
          <a href="#trips" className="nav-item">📍 Active Trips</a>
          <a href="#earnings" className="nav-item">💰 Earnings</a>
          <a href="#profile" className="nav-item">👤 Profile</a>
        </nav>

        <button className="logout-btn" onClick={() => logout()}>🚪 Logout</button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Welcome, {user?.firstName}</h1>
        </header>

        <div className="dashboard-content">
          <h2>Transporter Dashboard</h2>
          <p>Manage your vehicles and transportation requests</p>
        </div>
      </main>
    </div>
  );
};

export default TransporterDashboard;
