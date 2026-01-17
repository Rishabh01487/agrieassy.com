/**
 * ============================================
 * JWT TOKEN UTILITIES
 * ============================================
 * Functions for generating and verifying JWT tokens
 */

const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 * @param {Object} payload - Data to encode in token
 * @param {String} expiresIn - Token expiration time
 * @returns {String} JWT token
 */
const generateToken = (payload, expiresIn = process.env.JWT_EXPIRE || '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verify JWT Token
 * @param {String} token - Token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Generate Auth Response
 * Creates response object with token and user data
 * @param {Object} user - User document
 * @returns {Object} Auth response object
 */
const generateAuthResponse = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    role: user.role
  };

  const token = generateToken(payload);

  return {
    token,
    user: {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      city: user.city,
      state: user.state,
      rating: user.rating,
      profilePhoto: user.profilePhoto
    }
  };
};

module.exports = {
  generateToken,
  verifyToken,
  generateAuthResponse
};
