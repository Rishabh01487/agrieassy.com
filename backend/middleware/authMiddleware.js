/**
 * ============================================
 * AUTHENTICATION MIDDLEWARE
 * ============================================
 * JWT-based authentication
 * Verifies user token and attaches user info to request
 */

const jwt = require('jsonwebtoken');

/**
 * Auth Middleware
 * Verifies JWT token and protects routes
 * Checks if user is authenticated
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login first.',
        code: 'NO_TOKEN'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please login again.',
        code: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token.',
      code: 'INVALID_TOKEN'
    });
  }
};

/**
 * Role-based Authorization Middleware
 * Checks if user has required role
 * @param {Array} allowedRoles - Array of allowed roles
 */
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Only ${allowedRoles.join(', ')} can access this resource.`,
        code: 'UNAUTHORIZED_ROLE'
      });
    }
    next();
  };
};

/**
 * Farmer-only Middleware
 */
const farmersOnly = roleMiddleware(['farmer']);

/**
 * Buyer-only Middleware
 */
const buyersOnly = roleMiddleware(['buyer']);

/**
 * Transporter-only Middleware
 */
const transportersOnly = roleMiddleware(['transporter']);

module.exports = {
  authMiddleware,
  roleMiddleware,
  farmersOnly,
  buyersOnly,
  transportersOnly
};
