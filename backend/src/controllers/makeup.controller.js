import { getMakeupSuggestions } from '../services/makeup.service.js';
import { sendSuccess } from '../utils/response.js';

export const getMakeupMatch = async (req, res, next) => {
  try {
    const suggestions = getMakeupSuggestions({
      skinType: req.user.skinType,
      goals: req.user.goals,
    });
    return sendSuccess(res, suggestions);
  } catch (error) {
    next(error);
  }
};
