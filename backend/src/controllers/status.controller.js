import { sendSuccess } from '../utils/response.js';

/**
 * GET /api/status
 * Provides a simple health-check endpoint for uptime monitoring.
 */
export const getStatus = (req, res) => {
  return sendSuccess(res, { status: 'online', timestamp: new Date().toISOString() }, 'GlowTrack API status');
};
