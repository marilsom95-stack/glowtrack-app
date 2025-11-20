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
    const allowedFields = ['gender', 'age', 'skinType', 'goals', 'language', 'subscription'];
    const aliasFields = {
      tipoPele: 'skinType',
      objetivos: 'goals',
      idioma: 'language',
      assinatura: 'subscription',
    };
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    Object.entries(aliasFields).forEach(([alias, target]) => {
      if (req.body[alias] !== undefined) updates[target] = req.body[alias];
    });
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select('-password');
    return sendSuccess(res, { user }, 'Perfil atualizado.');
  } catch (error) {
    next(error);
  }
};
