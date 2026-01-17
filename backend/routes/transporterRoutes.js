/**
 * ============================================
 * TRANSPORTER ROUTES
 * ============================================
 * /api/transporter endpoints
 * Transporter profile, vehicles, transactions
 */

const express = require('express');
const router = express.Router();

const { authMiddleware, transportersOnly } = require('../middleware/authMiddleware');

/**
 * PROTECTED ROUTES - TRANSPORTERS ONLY
 */

/**
 * GET /api/transporter/profile
 * Get transporter profile
 */
router.get('/profile', authMiddleware, transportersOnly, (req, res) => {
  // Implementation in controller
  res.json({ message: 'Get transporter profile' });
});

/**
 * PUT /api/transporter/profile
 * Update transporter profile
 */
router.put('/profile', authMiddleware, transportersOnly, (req, res) => {
  // Implementation in controller
  res.json({ message: 'Update transporter profile' });
});

/**
 * GET /api/transporter/trips
 * Get transporter's trips
 */
router.get('/trips', authMiddleware, transportersOnly, (req, res) => {
  // Implementation in controller
  res.json({ message: 'Get transporter trips' });
});

/**
 * GET /api/transporter/earnings
 * Get transporter's earnings
 */
router.get('/earnings', authMiddleware, transportersOnly, (req, res) => {
  // Implementation in controller
  res.json({ message: 'Get transporter earnings' });
});

module.exports = router;
