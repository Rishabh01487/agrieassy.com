/**
 * ============================================
 * HOME PAGE
 * ============================================
 * Landing page with role selection
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      if (user.role === 'farmer') navigate('/farmer');
      else if (user.role === 'buyer') navigate('/buyer');
      else if (user.role === 'transporter') navigate('/transporter');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="logo">🌾 AgriEasy.com</h1>
          <div className="nav-links">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="nav-link">Login</Link>
              </>
            ) : (
              <>
                <span className="user-welcome">Welcome, {user?.firstName}</span>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>AgriEasy - Connecting Farmers, Buyers & Transporters</h2>
          <p>A revolutionary platform for agricultural commerce</p>
          <p className="hero-subtext">
            Direct connections between farmers and buyers, with integrated transportation services
          </p>
        </div>
      </section>

      {/* Role Selection */}
      <section className="roles-section">
        <h2>Join AgriEasy as a</h2>
        <div className="roles-grid">
          {/* Farmer Card */}
          <div className="role-card">
            <div className="role-icon">🚜</div>
            <h3>Farmer</h3>
            <p>List your crops and connect directly with buyers in your region</p>
            <ul className="features">
              <li>✓ List commodities with flexible pricing</li>
              <li>✓ Find buyers in your area</li>
              <li>✓ Arrange transportation</li>
              <li>✓ Track earnings</li>
            </ul>
            <div className="role-buttons">
              <Link to="/register/farmer" className="btn btn-primary">Register as Farmer</Link>
              {isAuthenticated && user.role === 'farmer' && (
                <Link to="/farmer" className="btn btn-secondary">Go to Dashboard</Link>
              )}
            </div>
          </div>

          {/* Buyer Card */}
          <div className="role-card">
            <div className="role-icon">🏪</div>
            <h3>Buyer / Retailer</h3>
            <p>Source quality produce directly from farmers at competitive prices</p>
            <ul className="features">
              <li>✓ Browse available commodities</li>
              <li>✓ Direct farmer negotiations</li>
              <li>✓ Flexible payment options</li>
              <li>✓ Digital invoicing</li>
            </ul>
            <div className="role-buttons">
              <Link to="/register/buyer" className="btn btn-primary">Register as Buyer</Link>
              {isAuthenticated && user.role === 'buyer' && (
                <Link to="/buyer" className="btn btn-secondary">Go to Dashboard</Link>
              )}
            </div>
          </div>

          {/* Transporter Card */}
          <div className="role-card">
            <div className="role-icon">🚛</div>
            <h3>Transporter / Vehicle Owner</h3>
            <p>Offer your logistics services and earn by connecting supply and demand</p>
            <ul className="features">
              <li>✓ Register your vehicles</li>
              <li>✓ Set your rates and service areas</li>
              <li>✓ Get transport requests</li>
              <li>✓ Track earnings</li>
            </ul>
            <div className="role-buttons">
              <Link to="/register/transporter" className="btn btn-primary">Register as Transporter</Link>
              {isAuthenticated && user.role === 'transporter' && (
                <Link to="/transporter" className="btn btn-secondary">Go to Dashboard</Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why AgriEasy?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h4>🔗 Direct Connections</h4>
            <p>Connect farmers directly with buyers, eliminating middlemen and reducing costs</p>
          </div>
          <div className="feature-item">
            <h4>📍 Location-Based Search</h4>
            <p>Find buyers, farmers, or transporters near you with intelligent filtering</p>
          </div>
          <div className="feature-item">
            <h4>💰 Fair Pricing</h4>
            <p>Negotiate prices directly between buyer and farmer for fair deals</p>
          </div>
          <div className="feature-item">
            <h4>🚛 Integrated Logistics</h4>
            <p>Seamless transportation booking with registered transporters</p>
          </div>
          <div className="feature-item">
            <h4>📋 Digital Invoicing</h4>
            <p>Automated billing after delivery with GST compliance</p>
          </div>
          <div className="feature-item">
            <h4>💳 Multiple Payment Options</h4>
            <p>Cash, cheque, UPI, or bank transfer - pay your way</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="cta-section">
          <h2>Ready to Transform Agricultural Commerce?</h2>
          <p>Join thousands of farmers, buyers, and transporters on AgriEasy</p>
          <Link to="/register/farmer" className="btn btn-large">Get Started Today</Link>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 AgriEasy.com - Connecting Agriculture. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
