import User from '../models/User.js';
import SkinProfile from '../models/SkinProfile.js';
import { sendSuccess } from '../utils/response.js';

export const getCurrentUser = async (req, res, next) => {
  try {
    const profile = await SkinProfile.findOne({ user: req.user._id });
    return sendSuccess(res, { user: req.user, skinProfile: profile });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const allowedFields = ['gender', 'age', 'skinType', 'goals'];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select('-password');
    return sendSuccess(res, { user }, 'Perfil atualizado.');
  } catch (error) {
    next(error);
  }
};
