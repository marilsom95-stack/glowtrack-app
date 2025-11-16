import Lifestyle from '../models/Lifestyle.js';
import { sendSuccess } from '../utils/response.js';
import {
  getFoodHighlights,
  getMovementSuggestions,
  hydrateLifestyle,
  getRandomQuote,
} from '../services/lifestyle.service.js';

const getOrCreateLifestyle = async (userId) => {
  const existing = await Lifestyle.findOne({ user: userId });
  if (existing) return existing;
  return Lifestyle.create({ user: userId });
};

export const getLifestyle = async (req, res, next) => {
  try {
    const lifestyle = await getOrCreateLifestyle(req.user._id);
    return sendSuccess(res, {
      lifestyle,
      foods: getFoodHighlights(),
      movement: getMovementSuggestions(),
    });
  } catch (error) {
    next(error);
  }
};

export const trackWater = async (req, res, next) => {
  try {
    const { cups = 1 } = req.body;
    const lifestyle = await getOrCreateLifestyle(req.user._id);
    hydrateLifestyle(lifestyle, cups);
    await lifestyle.save();
    return sendSuccess(res, { lifestyle }, 'Hidratação atualizada.');
  } catch (error) {
    next(error);
  }
};

export const saveWellbeingEntry = async (req, res, next) => {
  try {
    const { mood, note } = req.body;
    const lifestyle = await getOrCreateLifestyle(req.user._id);
    lifestyle.wellbeingEntries.unshift({
      mood,
      note,
      quote: getRandomQuote(),
    });
    await lifestyle.save();
    return sendSuccess(res, { lifestyle }, 'Diário atualizado.');
  } catch (error) {
    next(error);
  }
};
