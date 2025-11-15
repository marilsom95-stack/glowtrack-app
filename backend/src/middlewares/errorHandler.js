import { sendError } from '../utils/response.js';

/**
 * Centralized Express error handler middleware.
 */
export const errorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Unexpected server error';

  if (process.env.NODE_ENV !== 'production') {
    console.error('API Error:', err);
  }

  return sendError(res, status, message, {
    path: req.originalUrl,
    method: req.method
  });
};
