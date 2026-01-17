/**
 * ============================================
 * MAIN APP COMPONENT
 * ============================================
 * Root component with routing setup
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerDashboard from './pages/Farmer/FarmerDashboard';
import BuyerDashboard from './pages/Buyer/BuyerDashboard';
import TransporterDashboard from './pages/Transporter/TransporterDashboard';
import CommoditySearchPage from './pages/CommoditySearchPage';
import VehicleSearchPage from './pages/VehicleSearchPage';
import CommodityDetailPage from './pages/CommodityDetailPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import BillingPage from './pages/BillingPage';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/:role" element={<RegisterPage />} />
          <Route path="/search/commodities" element={<CommoditySearchPage />} />
          <Route path="/search/vehicles" element={<VehicleSearchPage />} />
          <Route path="/commodity/:id" element={<CommodityDetailPage />} />
          <Route path="/vehicle/:id" element={<VehicleDetailPage />} />
          <Route path="/billing" element={<BillingPage />} />

          {/* Farmer Routes */}
          <Route
            path="/farmer/*"
            element={
              <ProtectedRoute requiredRole="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Buyer Routes */}
          <Route
            path="/buyer/*"
            element={
              <ProtectedRoute requiredRole="buyer">
                <BuyerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Transporter Routes */}
          <Route
            path="/transporter/*"
            element={
              <ProtectedRoute requiredRole="transporter">
                <TransporterDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
