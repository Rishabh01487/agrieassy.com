/**
 * ============================================
 * API SERVICE
 * ============================================
 * Centralized API calls for all endpoints
 * Handles requests and responses
 */

import axios from 'axios';
import { API_ENDPOINTS } from '../config';

const apiClient = axios.create({
  baseURL: API_ENDPOINTS.baseURL || 'http://localhost:5000/api'
});

/**
 * Add auth token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Handle response errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Commodity APIs
 */
export const commodityService = {
  search: (filters) => apiClient.get('/commodity/search', { params: filters }),
  getDetails: (listingId) => apiClient.get(`/commodity/${listingId}`),
  create: (data) => apiClient.post('/commodity/create', data),
  update: (listingId, data) => apiClient.put(`/commodity/${listingId}`, data),
  delist: (listingId) => apiClient.delete(`/commodity/${listingId}`)
};

/**
 * Farmer APIs
 */
export const farmerService = {
  getProfile: () => apiClient.get('/farmer/profile'),
  updateProfile: (data) => apiClient.put('/farmer/profile', data),
  getListings: (filters) => apiClient.get('/farmer/listings', { params: filters }),
  getTransactions: (filters) => apiClient.get('/farmer/transactions', { params: filters }),
  getEarnings: () => apiClient.get('/farmer/earnings'),
  getOffers: (filters) => apiClient.get('/transaction/offers', { params: filters })
};

/**
 * Buyer APIs
 */
export const buyerService = {
  getProfile: () => apiClient.get('/buyer/profile'),
  updateProfile: (data) => apiClient.put('/buyer/profile', data),
  getPurchases: (filters) => apiClient.get('/buyer/purchases', { params: filters }),
  sendOffer: (data) => apiClient.post('/buyer/send-offer', data),
  getOffersReceived: (filters) => apiClient.get('/buyer/offers-received', { params: filters })
};

/**
 * Vehicle APIs
 */
export const vehicleService = {
  search: (filters) => apiClient.get('/vehicle/search', { params: filters }),
  getDetails: (vehicleId) => apiClient.get(`/vehicle/${vehicleId}`),
  register: (data) => apiClient.post('/vehicle/register', data),
  getMyVehicles: () => apiClient.get('/vehicle/my-vehicles/list'),
  update: (vehicleId, data) => apiClient.put(`/vehicle/${vehicleId}`, data),
  updateAvailability: (vehicleId, isAvailable) =>
    apiClient.patch(`/vehicle/${vehicleId}/availability`, { isAvailable })
};

/**
 * Transaction APIs
 */
export const transactionService = {
  acceptOffer: (transactionId) => apiClient.post(`/transaction/${transactionId}/accept`),
  rejectOffer: (transactionId, reason) =>
    apiClient.post(`/transaction/${transactionId}/reject`, { reason }),
  requestVehicle: (transactionId, vehicleId) =>
    apiClient.post(`/transaction/${transactionId}/request-vehicle`, { vehicleId }),
  getAvailableVehicles: (transactionId, filters) =>
    apiClient.get(`/transaction/${transactionId}/available-vehicles`, { params: filters })
};

/**
 * Billing APIs
 */
export const billingService = {
  create: (data) => apiClient.post('/billing/create', data),
  getDetails: (billingId) => apiClient.get(`/billing/${billingId}`),
  updatePayment: (billingId, data) => apiClient.put(`/billing/${billingId}/payment`, data),
  getBuyerBillings: (filters) => apiClient.get('/billing/buyer/list', { params: filters }),
  getFarmerBillings: (filters) => apiClient.get('/billing/farmer/list', { params: filters })
};

export default apiClient;
