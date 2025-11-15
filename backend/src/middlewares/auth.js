import { verifyToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';

export const authRequired = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return sendError(res, 401, 'Authentication token missing');
  }

  try {
    const payload = verifyToken(token);
    req.userId = payload.sub;
    return next();
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired token');
  }
};
