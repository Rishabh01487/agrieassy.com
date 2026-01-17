/**
 * ============================================
 * LOCATION UTILITIES
 * ============================================
 * Functions for geolocation calculations
 * Distance calculations, location-based filtering
 */

const { getDistance } = require('geolib');

/**
 * Calculate distance between two coordinates
 * @param {Array} coord1 - [latitude, longitude]
 * @param {Array} coord2 - [latitude, longitude]
 * @returns {Number} Distance in kilometers
 */
const calculateDistance = (coord1, coord2) => {
  const distanceInMeters = getDistance(
    { latitude: coord1[0], longitude: coord1[1] },
    { latitude: coord2[0], longitude: coord2[1] }
  );
  return distanceInMeters / 1000; // Convert to km
};

/**
 * Generate geolocation query for MongoDB
 * Finds locations within specified distance
 * @param {Number} longitude - User's longitude
 * @param {Number} latitude - User's latitude
 * @param {Number} maxDistance - Maximum distance in meters
 * @returns {Object} MongoDB geospatial query
 */
const generateGeoQuery = (longitude, latitude, maxDistance = 50000) => {
  return {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      $maxDistance: maxDistance
    }
  };
};

module.exports = {
  calculateDistance,
  generateGeoQuery
};
