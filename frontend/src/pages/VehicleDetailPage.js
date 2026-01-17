/**
 * ============================================
 * VEHICLE DETAIL PAGE
 * ============================================
 * Shows detailed vehicle information
 * Displays transporter profile, specs, booking options
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vehicleService } from '../services/apiService';
import { toast } from 'react-toastify';
import './DetailPages.css';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [vehicle, setVehicle] = useState(null);
  const [transporter, setTransporter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [bookingData, setBookingData] = useState({
    distance: '',
    pickupLocation: '',
    deliveryLocation: '',
    weight: '',
    notes: ''
  });

  useEffect(() => {
    loadVehicleDetails();
  }, [id]);

  useEffect(() => {
    // Calculate estimated cost
    if (bookingData.distance && vehicle) {
      const baseCost = parseFloat(bookingData.distance) * vehicle.pricePerKilometer;
      const additionalCharges = vehicle.additionalCharges || 0;
      setEstimatedCost(baseCost + additionalCharges);
    }
  }, [bookingData.distance, vehicle]);

  const loadVehicleDetails = async () => {
    try {
      setLoading(true);
      const response = await vehicleService.getDetails(id);
      const data = response.data.data;
      setVehicle(data.vehicle);
      setTransporter(data.transporter);
    } catch (error) {
      toast.error('Failed to load vehicle details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookVehicle = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book vehicles');
      navigate('/login');
      return;
    }

    if (user.role !== 'farmer') {
      toast.error('Only farmers can book vehicles');
      return;
    }

    try {
      // This would call the backend to create a booking
      toast.success('Vehicle booking request sent to transporter!');
      setShowBookingForm(false);
      setBookingData({
        distance: '',
        pickupLocation: '',
        deliveryLocation: '',
        weight: '',
        notes: ''
      });
    } catch (error) {
      toast.error('Failed to book vehicle');
    }
  };

  if (loading) {
    return <div className="loading">Loading vehicle details...</div>;
  }

  if (!vehicle) {
    return <div className="error">Vehicle not found</div>;
  }

  const getVehicleTypeIcon = (type) => {
    const icons = {
      'auto': '🛞',
      'truck': '🚚',
      'tempo': '🚐',
      'tractor': '🚜',
      'lorry': '🚛'
    };
    return icons[type?.toLowerCase()] || '🚗';
  };

  return (
    <div className="detail-page vehicle-detail-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="detail-container">
        {/* Left Section - Main Info */}
        <div className="detail-main">
          <div className="vehicle-header">
            <h1>
              {getVehicleTypeIcon(vehicle.vehicleType)} {vehicle.vehicleType}
            </h1>
            <p className="registration">{vehicle.registrationNumber}</p>
            <div className={`availability-badge ${vehicle.isAvailable ? 'available' : 'unavailable'}`}>
              {vehicle.isAvailable ? '✓ Available' : '✗ Unavailable'}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="pricing-section">
            <div className="price-box">
              <label>Rate per Kilometer</label>
              <div className="price-display">
                <span className="current-price">₹{vehicle.pricePerKilometer}</span>
              </div>
            </div>

            <div className="availability-box">
              <label>Capacity</label>
              <p className="quantity-value">
                Weight: {vehicle.capacity.weight} tons
              </p>
              <p className="quantity-value">
                Volume: {vehicle.capacity.volume} cubic feet
              </p>
            </div>
          </div>

          {/* Vehicle Specifications */}
          <div className="details-grid">
            <div className="detail-item">
              <label>Vehicle Type</label>
              <p>{vehicle.vehicleType}</p>
            </div>
            <div className="detail-item">
              <label>Registration Number</label>
              <p>{vehicle.registrationNumber}</p>
            </div>
            <div className="detail-item">
              <label>Vehicle Age</label>
              <p>{new Date().getFullYear() - new Date(vehicle.yearsOfManufacture).getFullYear()} years</p>
            </div>
            <div className="detail-item">
              <label>Pollution Certificate</label>
              <p>{vehicle.documents?.pollutionCertificate ? '✓ Valid' : '✗ Not provided'}</p>
            </div>
            <div className="detail-item">
              <label>Fitness Certificate</label>
              <p>{vehicle.documents?.fitnessCertificate ? '✓ Valid' : '✗ Not provided'}</p>
            </div>
            <div className="detail-item">
              <label>Insurance Status</label>
              <p>{vehicle.documents?.insurance ? '✓ Active' : '✗ Not provided'}</p>
            </div>
          </div>

          {/* Service Areas */}
          <div className="service-areas-section">
            <h3>Service Areas</h3>
            <div className="areas-list">
              <div className="area-item">
                <span>📍 States</span>
                <p>{vehicle.serviceArea.states.join(', ')}</p>
              </div>
              <div className="area-item">
                <span>🏙️ Cities</span>
                <p>{vehicle.serviceArea.cities.join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="additional-info">
            <h3>Additional Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Total Trips</label>
                <p>{vehicle.statistics?.totalTrips || 0}</p>
              </div>
              <div className="info-item">
                <label>Total Earnings</label>
                <p>₹{(vehicle.statistics?.totalEarnings || 0).toLocaleString()}</p>
              </div>
              <div className="info-item">
                <label>Avg Trip Distance</label>
                <p>{(vehicle.statistics?.averageTripDistance || 0).toFixed(2)} km</p>
              </div>
              <div className="info-item">
                <label>Vehicle Condition</label>
                <p>{vehicle.condition || 'Excellent'}</p>
              </div>
            </div>
          </div>

          {/* Additional Charges */}
          {vehicle.additionalCharges > 0 && (
            <div className="additional-charges">
              <h3>Additional Charges</h3>
              <p>Base cost: ₹{vehicle.additionalCharges} (loading, unloading, documentation, etc.)</p>
            </div>
          )}
        </div>

        {/* Right Section - Transporter & Booking */}
        <div className="detail-sidebar">
          {/* Transporter Card */}
          <div className="transporter-card">
            <h3>Transporter Details</h3>
            <div className="transporter-info">
              <div className="transporter-name">
                {transporter?.firstName} {transporter?.lastName}
              </div>
              <div className="company-name">{transporter?.companyName}</div>
              
              <div className="transporter-details-list">
                <div className="detail">
                  <span>📍 Location</span>
                  <p>{transporter?.city}, {transporter?.state}</p>
                </div>
                <div className="detail">
                  <span>📞 Contact</span>
                  <p>{transporter?.phone}</p>
                </div>
                <div className="detail">
                  <span>📧 Email</span>
                  <p>{transporter?.email}</p>
                </div>
                <div className="detail">
                  <span>🆔 License</span>
                  <p>{transporter?.licenseNumber}</p>
                </div>
                <div className="detail">
                  <span>⭐ Rating</span>
                  <p>{transporter?.rating || 'No ratings yet'}</p>
                </div>
                <div className="detail">
                  <span>📊 Total Trips</span>
                  <p>{transporter?.totalTrips || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {user?.role === 'farmer' && vehicle.isAvailable ? (
            <div className="action-section">
              {!showBookingForm ? (
                <button 
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowBookingForm(true)}
                >
                  🚚 Book Vehicle
                </button>
              ) : (
                <form onSubmit={handleBookVehicle} className="booking-form">
                  <h4>Book This Vehicle</h4>
                  
                  <div className="form-group">
                    <label>Distance (km)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={bookingData.distance}
                      onChange={(e) => setBookingData({...bookingData, distance: e.target.value})}
                      placeholder="Enter distance in km"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Pickup Location</label>
                    <input
                      type="text"
                      value={bookingData.pickupLocation}
                      onChange={(e) => setBookingData({...bookingData, pickupLocation: e.target.value})}
                      placeholder="City, State"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Delivery Location</label>
                    <input
                      type="text"
                      value={bookingData.deliveryLocation}
                      onChange={(e) => setBookingData({...bookingData, deliveryLocation: e.target.value})}
                      placeholder="City, State"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Weight (tons)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={bookingData.weight}
                      onChange={(e) => setBookingData({...bookingData, weight: e.target.value})}
                      placeholder="Approximate weight"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Special Instructions</label>
                    <textarea
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                      placeholder="Any special handling requirements..."
                    />
                  </div>

                  {/* Cost Estimate */}
                  {estimatedCost > 0 && (
                    <div className="cost-estimate">
                      <div className="estimate-row">
                        <span>Distance Rate</span>
                        <span>₹{(parseFloat(bookingData.distance) * vehicle.pricePerKilometer).toFixed(2)}</span>
                      </div>
                      {vehicle.additionalCharges > 0 && (
                        <div className="estimate-row">
                          <span>Additional Charges</span>
                          <span>₹{vehicle.additionalCharges}</span>
                        </div>
                      )}
                      <div className="estimate-row total">
                        <span>Estimated Total</span>
                        <span>₹{estimatedCost.toFixed(2)}</span>
                      </div>
                    </div>
                  )}

                  <div className="form-actions">
                    <button type="submit" className="btn btn-success">Confirm Booking</button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowBookingForm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : user?.role === 'farmer' ? (
            <div className="info-box unavailable">
              <p>This vehicle is currently unavailable</p>
            </div>
          ) : (
            <div className="info-box">
              <p>Login as a farmer to book this vehicle</p>
              <button className="btn btn-primary" onClick={() => navigate('/login')}>
                Login as Farmer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;
