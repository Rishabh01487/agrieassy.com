/**
 * ============================================
 * REGISTER PAGE
 * ============================================
 */

import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './AuthPages.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    // Role-specific
    farmName: '',
    landArea: '',
    farmingType: [],
    shopName: '',
    businessType: '',
    gstin: '',
    transporterType: '',
    companyName: '',
    operatingRegions: []
  });

  const roleConfig = {
    farmer: {
      title: 'Register as Farmer',
      icon: '🚜',
      fields: ['farmName', 'landArea', 'farmingType']
    },
    buyer: {
      title: 'Register as Buyer',
      icon: '🏪',
      fields: ['shopName', 'businessType', 'gstin']
    },
    transporter: {
      title: 'Register as Transporter',
      icon: '🚛',
      fields: ['transporterType', 'companyName', 'operatingRegions']
    }
  };

  const config = roleConfig[role] || {};

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (type === 'checkbox') {
      if (name === 'farmingType' || name === 'operatingRegions') {
        setFormData(prev => ({
          ...prev,
          [name]: checked
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const userData = {
        ...formData,
        role
      };
      await register(role, userData);
      toast.success('Registration successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form">
          <h1>{config.icon} {config.title}</h1>
          <p className="subtitle">Join AgriEasy and start your agricultural business today</p>

          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            {currentStep === 1 && (
              <>
                <h3>Personal Information</h3>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Phone (10 digits)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength="6"
                    required
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  onClick={() => setCurrentStep(2)}
                >
                  Next
                </button>
              </>
            )}

            {/* Location Information */}
            {currentStep === 2 && (
              <>
                <h3>Location Details</h3>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Pincode (6 digits)</label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    pattern="[0-9]{6}"
                    required
                  />
                </div>

                <div className="button-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCurrentStep(3)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* Role-Specific Information */}
            {currentStep === 3 && (
              <>
                <h3>Role-Specific Information</h3>

                {role === 'farmer' && (
                  <>
                    <div className="form-group">
                      <label>Farm Name</label>
                      <input
                        type="text"
                        name="farmName"
                        value={formData.farmName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Land Area (in acres)</label>
                      <input
                        type="number"
                        name="landArea"
                        value={formData.landArea}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Farming Type</label>
                      <div className="checkbox-group">
                        {[
                          'Crop Production',
                          'Livestock',
                          'Dairy',
                          'Organic Farming'
                        ].map(type => (
                          <label key={type}>
                            <input
                              type="checkbox"
                              name="farmingType"
                              value={type}
                              checked={formData.farmingType.includes(type)}
                              onChange={handleChange}
                            />
                            {type}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {role === 'buyer' && (
                  <>
                    <div className="form-group">
                      <label>Shop Name</label>
                      <input
                        type="text"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Business Type</label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Business Type</option>
                        <option value="Retail Shop">Retail Shop</option>
                        <option value="Wholesale Market">Wholesale Market</option>
                        <option value="Processor">Processor</option>
                        <option value="Exporter">Exporter</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>GSTIN</label>
                      <input
                        type="text"
                        name="gstin"
                        value={formData.gstin}
                        onChange={handleChange}
                        placeholder="15 character GSTIN"
                        required
                      />
                    </div>
                  </>
                )}

                {role === 'transporter' && (
                  <>
                    <div className="form-group">
                      <label>Transporter Type</label>
                      <select
                        name="transporterType"
                        value={formData.transporterType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="Vehicle Owner">Vehicle Owner</option>
                        <option value="Driver">Driver</option>
                        <option value="Transport Company">Transport Company</option>
                      </select>
                    </div>

                    {formData.transporterType === 'Transport Company' && (
                      <div className="form-group">
                        <label>Company Name</label>
                        <input
                          type="text"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          required={formData.transporterType === 'Transport Company'}
                        />
                      </div>
                    )}
                  </>
                )}

                <div className="button-group">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCurrentStep(2)}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>

        <div className="auth-sidebar">
          <h2>{config.icon} {role?.toUpperCase()}</h2>
          <p>Join AgriEasy and become part of the agricultural revolution</p>
          <div className="features-list">
            <div className="feature">✓ Easy registration process</div>
            <div className="feature">✓ Secure platform</div>
            <div className="feature">✓ Direct connections</div>
            <div className="feature">✓ Fair pricing</div>
            <div className="feature">✓ Real-time notifications</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
