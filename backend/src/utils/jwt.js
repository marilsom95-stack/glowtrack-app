import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'glowtrack-secret';
const EXPIRATION = '7d';

export const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, {
    expiresIn: EXPIRATION,
  });

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
