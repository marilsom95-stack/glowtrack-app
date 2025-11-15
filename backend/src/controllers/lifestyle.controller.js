import { LifestyleProfile } from '../models/lifestyleProfile.model.js';
import { LifestyleLog } from '../models/lifestyleLog.model.js';
import { sendError, sendSuccess } from '../utils/response.js';

const normalizeDate = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const upsertLifestyleProfile = async (req, res) => {
  try {
    const profile = await LifestyleProfile.findOneAndUpdate(
      { userId: req.userId },
      { ...req.body, userId: req.userId },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return sendSuccess(res, { profile }, 'Lifestyle goals updated');
  } catch (error) {
    return sendError(res, 500, 'Failed to save lifestyle profile', { error: error.message });
  }
};

export const getLifestyleProfile = async (req, res) => {
  try {
    const profile = await LifestyleProfile.findOne({ userId: req.userId });
    if (!profile) {
      return sendError(res, 404, 'Lifestyle profile not found');
    }
    return sendSuccess(res, { profile });
  } catch (error) {
    return sendError(res, 500, 'Failed to fetch lifestyle profile', { error: error.message });
  }
};

export const logTodayLifestyle = async (req, res) => {
  try {
    const { waterMl = 0, healthyMeals = 0, exerciseDone = false, notes, date } = req.body;
    const normalizedDate = normalizeDate(date ? new Date(date) : new Date());
    const log = await LifestyleLog.findOneAndUpdate(
      { userId: req.userId, date: normalizedDate },
      { waterMl, healthyMeals, exerciseDone, notes },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return sendSuccess(res, { log }, 'Registo diário atualizado');
  } catch (error) {
    return sendError(res, 500, 'Failed to save lifestyle log', { error: error.message });
  }
};

export const getTodayLifestyleLog = async (req, res) => {
  try {
    const today = normalizeDate();
    const log = await LifestyleLog.findOne({ userId: req.userId, date: today });
    return sendSuccess(res, { log });
  } catch (error) {
    return sendError(res, 500, 'Failed to fetch lifestyle log', { error: error.message });
  }
};

export const getLifestyleSummary = async (req, res) => {
  try {
    const today = normalizeDate();
    const start = new Date(today);
    start.setDate(start.getDate() - 6);

    const logs = await LifestyleLog.find({ userId: req.userId, date: { $gte: start } }).sort({ date: 1 });
    const profile = await LifestyleProfile.findOne({ userId: req.userId });
    const goalWater = profile?.waterGoalMl || 2000;

    const totalWater = logs.reduce((sum, log) => sum + log.waterMl, 0);
    const avgWater = logs.length ? Math.round(totalWater / logs.length) : 0;
    const exerciseDays = logs.filter((log) => log.exerciseDone).length;
    const healthyMealsAvg = logs.length
      ? Number((logs.reduce((sum, log) => sum + log.healthyMeals, 0) / logs.length).toFixed(1))
      : 0;
    const hydrationSuccessDays = logs.filter((log) => log.waterMl >= goalWater).length;

    return sendSuccess(res, {
      range: { start, end: today },
      avgWater,
      healthyMealsAvg,
      exerciseDays,
      hydrationSuccessDays
    });
  } catch (error) {
    return sendError(res, 500, 'Failed to summarize lifestyle data', { error: error.message });
  }
};
