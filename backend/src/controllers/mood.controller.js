import { MoodEntry } from '../models/moodEntry.model.js';
import { sendError, sendSuccess } from '../utils/response.js';

const normalizeDate = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const createMoodEntry = async (req, res) => {
  try {
    const { mood, note, date } = req.body;
    if (!mood) {
      return sendError(res, 422, 'Mood é obrigatório');
    }

    const normalizedDate = normalizeDate(date ? new Date(date) : new Date());
    const entry = await MoodEntry.findOneAndUpdate(
      { userId: req.userId, date: normalizedDate },
      { mood, note },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return sendSuccess(res, { entry }, 'Mood atualizado');
  } catch (error) {
    return sendError(res, 500, 'Failed to save mood entry', { error: error.message });
  }
};

export const getRecentMoodEntries = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    const entries = await MoodEntry.find({ userId: req.userId })
      .sort({ date: -1 })
      .limit(limit);
    return sendSuccess(res, { entries });
  } catch (error) {
    return sendError(res, 500, 'Failed to fetch mood entries', { error: error.message });
  }
};
