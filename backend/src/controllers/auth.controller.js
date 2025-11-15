import { validationResult } from 'express-validator';
import { User } from '../models/user.model.js';
import { signToken } from '../utils/jwt.js';
import { sendError, sendSuccess } from '../utils/response.js';

const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extracted = errors.array().map((err) => ({ field: err.param, message: err.msg }));
    sendError(res, 422, 'Validation failed', { errors: extracted });
    return true;
  }
  return false;
};

export const register = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email, provider: 'local' });
    if (existingUser) {
      return sendError(res, 409, 'Email already registered');
    }

    const user = await User.create({
      name,
      email,
      password,
      provider: 'local'
    });

    const token = signToken(user);
    return sendSuccess(
      res,
      { user: { id: user._id, name: user.name, email: user.email }, token },
      'Registration successful'
    );
  } catch (error) {
    return sendError(res, 500, 'Failed to register user', { error: error.message });
  }
};

export const login = async (req, res) => {
  if (handleValidationErrors(req, res)) return;

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, provider: 'local' });
    if (!user || !(await user.comparePassword(password))) {
      return sendError(res, 401, 'Invalid credentials');
    }

    const token = signToken(user);
    return sendSuccess(
      res,
      { user: { id: user._id, name: user.name, email: user.email }, token },
      'Login successful'
    );
  } catch (error) {
    return sendError(res, 500, 'Failed to login', { error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    return sendSuccess(res, { user }, 'Authenticated user profile');
  } catch (error) {
    return sendError(res, 500, 'Failed to fetch profile', { error: error.message });
  }
};
