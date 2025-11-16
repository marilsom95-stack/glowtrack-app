import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return sendError(res, 401, 'Autenticação necessária.');
    }
    const token = header.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload) {
      return sendError(res, 401, 'Sessão expirada, inicia novamente.');
    }
    const user = await User.findById(payload.id).select('-password');
    if (!user) {
      return sendError(res, 401, 'Utilizador não encontrado.');
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
