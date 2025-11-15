import { findOrCreateOAuthUser } from '../services/oauth.service.js';
import { sendError, sendSuccess } from '../utils/response.js';
import { signToken } from '../utils/jwt.js';

const buildOAuthResponse = (res, user, provider) => {
  const token = signToken(user);
  return sendSuccess(res, {
    provider,
    user: { id: user._id, name: user.name, email: user.email },
    token
  });
};

export const googleCallbackHandler = async (req, res) => {
  try {
    const providerId = req.query.state || 'google-placeholder-id';
    const profileData = {
      name: req.query.name || 'Google User',
      email: req.query.email || 'google.user@example.com'
    };

    const user = await findOrCreateOAuthUser('google', providerId, profileData);
    return buildOAuthResponse(res, user, 'google');
  } catch (error) {
    return sendError(res, 500, 'Google OAuth callback failed', { error: error.message });
  }
};

export const appleCallbackHandler = async (req, res) => {
  try {
    const providerId = req.body?.state || req.query?.state || 'apple-placeholder-id';
    const profileData = {
      name: req.body?.name || req.query?.name || 'Apple User',
      email: req.body?.email || req.query?.email || 'apple.user@example.com'
    };

    const user = await findOrCreateOAuthUser('apple', providerId, profileData);
    return buildOAuthResponse(res, user, 'apple');
  } catch (error) {
    return sendError(res, 500, 'Apple OAuth callback failed', { error: error.message });
  }
};
