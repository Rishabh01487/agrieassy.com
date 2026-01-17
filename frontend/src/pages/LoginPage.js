/**
 * ============================================
 * LOGIN PAGE
 * ============================================
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AuthPages.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      // Navigation happens automatically via auth context
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form">
          <h1>🌾 AgriEasy Login</h1>
          <p className="subtitle">Connect with farmers, buyers & transporters</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register/farmer">Register here</Link>
          </p>
        </div>

        <div className="auth-sidebar">
          <h2>Welcome Back!</h2>
          <p>AgriEasy connects farmers directly with buyers and transporters for better agricultural commerce</p>
          <div className="features-list">
            <div className="feature">✓ Direct farmer-buyer connections</div>
            <div className="feature">✓ Fair pricing negotiations</div>
            <div className="feature">✓ Integrated logistics</div>
            <div className="feature">✓ Digital invoicing</div>
            <div className="feature">✓ Multiple payment options</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
