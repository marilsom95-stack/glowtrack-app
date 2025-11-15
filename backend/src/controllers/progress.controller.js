import { ProgressPhoto } from '../models/progressPhoto.model.js';
import { RoutineCheckin } from '../models/routineCheckin.model.js';
import { LifestyleLog } from '../models/lifestyleLog.model.js';
import { MoodEntry } from '../models/moodEntry.model.js';
import { sendError, sendSuccess } from '../utils/response.js';

const getDayKey = (date) => date.toISOString().split('T')[0];

const computeStreak = (keys) => {
  if (!keys.length) return 0;
  const sorted = [...keys]
    .map((key) => new Date(key))
    .sort((a, b) => a.getTime() - b.getTime());
  let streak = 0;
  let current = 0;
  let prev = null;
  sorted.forEach((date) => {
    if (prev) {
      const diff = date.getTime() - prev.getTime();
      if (diff <= 24 * 60 * 60 * 1000) {
        current += 1;
      } else {
        current = 1;
      }
    } else {
      current = 1;
    }
    prev = date;
    streak = Math.max(streak, current);
  });
  return streak;
};

export const addProgressPhoto = async (req, res) => {
  try {
    const { imageUrl, note, date } = req.body;
    if (!imageUrl) {
      return sendError(res, 422, 'imageUrl é obrigatório (pode ser mock por agora)');
    }

    const photo = await ProgressPhoto.create({
      userId: req.userId,
      imageUrl,
      note,
      date: date ? new Date(date) : new Date()
    });

    return sendSuccess(res, { photo }, 'Foto de progresso registada');
  } catch (error) {
    return sendError(res, 500, 'Failed to save progress photo', { error: error.message });
  }
};

export const getProgressPhotos = async (req, res) => {
  try {
    const photos = await ProgressPhoto.find({ userId: req.userId }).sort({ date: -1 });
    return sendSuccess(res, { photos });
  } catch (error) {
    return sendError(res, 500, 'Failed to fetch progress photos', { error: error.message });
  }
};

export const getProgressSummary = async (req, res) => {
  try {
    const userId = req.userId;
    const checkins = await RoutineCheckin.find({ userId });
    const lifestyleLogs = await LifestyleLog.find({ userId });
    const moods = await MoodEntry.find({ userId });

    const routineDays = new Set(checkins.map((c) => getDayKey(c.date)));
    const hydrationDays = new Set(lifestyleLogs.filter((log) => log.waterMl > 0).map((log) => getDayKey(log.date)));
    const moodDays = new Set(moods.map((m) => getDayKey(m.date)));

    const streak = computeStreak(Array.from(routineDays));

    return sendSuccess(res, {
      routineDays: routineDays.size,
      hydrationDays: hydrationDays.size,
      moodDays: moodDays.size,
      skinCareStreak: streak
    });
  } catch (error) {
    return sendError(res, 500, 'Failed to summarize progress', { error: error.message });
  }
};
