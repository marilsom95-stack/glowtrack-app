import jwt from 'jsonwebtoken';
import { getEnvConfig } from '../config/env.js';

const { jwtSecret, jwtExpiresIn } = getEnvConfig();

if (!jwtSecret) {
  console.warn('⚠️  JWT_SECRET is not set. Tokens cannot be securely generated.');
}

export const signToken = (user) => {
  if (!jwtSecret) {
    throw new Error('JWT secret missing');
  }

  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email
    },
    jwtSecret,
    {
      expiresIn: jwtExpiresIn || '7d'
    }
  );
};

export const verifyToken = (token) => {
  if (!jwtSecret) {
    throw new Error('JWT secret missing');
  }

  return jwt.verify(token, jwtSecret);
};
