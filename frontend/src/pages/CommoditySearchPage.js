/**
 * ============================================
 * COMMODITY SEARCH PAGE
 * ============================================
 */

import React, { useState } from 'react';
import { commodityService } from '../services/apiService';
import { toast } from 'react-toastify';
import './SearchPages.css';

const CommoditySearchPage = () => {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    commodityType: '',
    city: '',
    maxPrice: '',
    minPrice: ''
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
      const response = await commodityService.search(filters);
      setCommodities(response.data.data.listings);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>🌾 Search Commodities</h1>
        <p>Find the best commodities from farmers near you</p>
      </div>

      <div className="search-container">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="form-group">
            <label>Commodity Type</label>
            <select name="commodityType" value={filters.commodityType} onChange={handleFilterChange}>
              <option value="">All Commodities</option>
              <option value="Rice">Rice</option>
              <option value="Wheat">Wheat</option>
              <option value="Corn">Corn</option>
              <option value="Sugarcane">Sugarcane</option>
            </select>
          </div>

          <div className="form-group">
            <label>City</label>
            <input type="text" name="city" value={filters.city} onChange={handleFilterChange} placeholder="Enter city" />
          </div>

          <div className="form-group">
            <label>Price Range</label>
            <div className="price-range">
              <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min" />
              <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="results">
          <h2>Results ({commodities.length})</h2>
          {commodities.map(commodity => (
            <div key={commodity._id} className="commodity-card">
              <h3>{commodity.commodityType}</h3>
              <p>{commodity.varietySubtype}</p>
              <p>₹{commodity.pricePerUnit.amount}/{commodity.pricePerUnit.unit}</p>
              <p>{commodity.availableQuantity.value} {commodity.availableQuantity.unit} available</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommoditySearchPage;
