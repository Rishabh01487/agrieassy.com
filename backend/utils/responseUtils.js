/**
 * ============================================
 * RESPONSE UTILITIES
 * ============================================
 * Standard response formatting
 * Success and error response structures
 */

/**
 * Send Success Response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Response message
 * @param {Object} data - Response data
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  res.status(statusCode).json({
    success: true,
    message,
    ...(data && { data })
  });
};

/**
 * Send Error Response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Error message
 * @param {String} code - Error code
 */
const sendError = (res, statusCode = 500, message = 'Error', code = 'ERROR') => {
  res.status(statusCode).json({
    success: false,
    message,
    code
  });
};

module.exports = {
  sendSuccess,
  sendError
};
