/**
 * Sends a standardized success response to the client.
 * @param {import('express').Response} res
 * @param {object} data
 * @param {string} [message]
 */
export const sendSuccess = (res, data = {}, message = 'Request successful') => {
  return res.status(200).json({
    success: true,
    message,
    data
  });
};

/**
 * Sends a standardized error response to the client.
 * @param {import('express').Response} res
 * @param {number} status
 * @param {string} message
 * @param {object} [details]
 */
export const sendError = (res, status = 500, message = 'An unexpected error occurred', details = {}) => {
  return res.status(status).json({
    success: false,
    message,
    details
  });
};
