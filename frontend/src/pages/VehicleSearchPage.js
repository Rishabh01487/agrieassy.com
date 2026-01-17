/**
 * ============================================
 * VEHICLE SEARCH PAGE
 * ============================================
 */

import React, { useState } from 'react';
import { vehicleService } from '../services/apiService';
import { toast } from 'react-toastify';
import './SearchPages.css';

const VehicleSearchPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    vehicleType: '',
    state: '',
    maxPrice: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await vehicleService.search(filters);
      setVehicles(response.data.data.vehicles);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>🚛 Search Vehicles</h1>
        <p>Find the best transportation options for your commodities</p>
      </div>

      <div className="search-container">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="form-group">
            <label>Vehicle Type</label>
            <select name="vehicleType" value={filters.vehicleType} onChange={handleFilterChange}>
              <option value="">All Vehicles</option>
              <option value="Mini Truck (1-2 Ton)">Mini Truck</option>
              <option value="Small Truck (2-5 Ton)">Small Truck</option>
              <option value="Medium Truck (5-10 Ton)">Medium Truck</option>
            </select>
          </div>

          <div className="form-group">
            <label>State</label>
            <input type="text" name="state" value={filters.state} onChange={handleFilterChange} placeholder="Enter state" />
          </div>

          <div className="form-group">
            <label>Max Price per KM</label>
            <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Enter max price" />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="results">
          <h2>Available Vehicles ({vehicles.length})</h2>
          {vehicles.map(vehicle => (
            <div key={vehicle._id} className="vehicle-card">
              <h3>{vehicle.vehicleType}</h3>
              <p>Registration: {vehicle.vehicleRegistration.registrationNumber}</p>
              <p>₹{vehicle.pricePerKilometer.amount}/km</p>
              <p>Capacity: {vehicle.capacity.weight.value} {vehicle.capacity.weight.unit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleSearchPage;
