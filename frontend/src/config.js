/**
 * ============================================
 * FRONTEND CONFIGURATION
 * ============================================
 * API endpoints and app configuration
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth
  REGISTER_FARMER: `${API_BASE_URL}/auth/register/farmer`,
  REGISTER_BUYER: `${API_BASE_URL}/auth/register/buyer`,
  REGISTER_TRANSPORTER: `${API_BASE_URL}/auth/register/transporter`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  GET_CURRENT_USER: `${API_BASE_URL}/auth/me`,

  // Farmer
  FARMER_PROFILE: `${API_BASE_URL}/farmer/profile`,
  FARMER_LISTINGS: `${API_BASE_URL}/farmer/listings`,
  FARMER_TRANSACTIONS: `${API_BASE_URL}/farmer/transactions`,
  FARMER_EARNINGS: `${API_BASE_URL}/farmer/earnings`,
  FARMER_OFFERS: `${API_BASE_URL}/transaction/offers`,

  // Buyer
  BUYER_PROFILE: `${API_BASE_URL}/buyer/profile`,
  BUYER_PURCHASES: `${API_BASE_URL}/buyer/purchases`,
  BUYER_SEND_OFFER: `${API_BASE_URL}/buyer/send-offer`,
  BUYER_OFFERS_RECEIVED: `${API_BASE_URL}/buyer/offers-received`,

  // Commodities
  COMMODITY_SEARCH: `${API_BASE_URL}/commodity/search`,
  COMMODITY_CREATE: `${API_BASE_URL}/commodity/create`,
  COMMODITY_DETAILS: `${API_BASE_URL}/commodity`,

  // Vehicles
  VEHICLE_SEARCH: `${API_BASE_URL}/vehicle/search`,
  VEHICLE_REGISTER: `${API_BASE_URL}/vehicle/register`,
  VEHICLE_TRANSPORTER: `${API_BASE_URL}/vehicle/my-vehicles/list`,
  VEHICLE_DETAILS: `${API_BASE_URL}/vehicle`,

  // Transactions
  TRANSACTION_ACCEPT_OFFER: `${API_BASE_URL}/transaction`,
  TRANSACTION_REQUEST_VEHICLE: `${API_BASE_URL}/transaction`,
  AVAILABLE_VEHICLES: `${API_BASE_URL}/transaction`,

  // Billing
  BILLING_CREATE: `${API_BASE_URL}/billing/create`,
  BILLING_DETAILS: `${API_BASE_URL}/billing`,
  BILLING_PAYMENT: `${API_BASE_URL}/billing`,
  BUYER_BILLINGS: `${API_BASE_URL}/billing/buyer/list`,
  FARMER_BILLINGS: `${API_BASE_URL}/billing/farmer/list`
};

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'joinRoom',
  COMMODITY_LISTED: 'farmerListCommodity',
  OFFER_SENT: 'sendOfferToFarmer',
  OFFER_ACCEPTED: 'acceptOffer',
  VEHICLE_REQUESTED: 'requestVehicle',
  VEHICLE_ALLOCATED: 'vehicleAllocated',
  BILLING_CREATED: 'billingCreated',
  PAYMENT_RECEIVED: 'paymentReceived',
  NEW_COMMODITY: 'newCommodityAvailable',
  OFFER_NOTIFICATION: 'offerReceived',
  VEHICLE_NOTIFICATION: 'vehicleAllocated'
};

export { SOCKET_URL };
