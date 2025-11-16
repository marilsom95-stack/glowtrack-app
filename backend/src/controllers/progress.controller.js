import Progress from '../models/Progress.js';
import Photo from '../models/Photo.js';
import { sendError, sendSuccess } from '../utils/response.js';
import { calculateAchievements, updateStreak } from '../services/progress.service.js';

const getOrCreateProgress = async (userId) => {
  const existing = await Progress.findOne({ user: userId });
  if (existing) return existing;
  return Progress.create({ user: userId });
};

export const getProgressOverview = async (req, res, next) => {
  try {
    const progress = await getOrCreateProgress(req.user._id);
    const photos = await Photo.find({ user: req.user._id }).sort({ takenAt: -1 });
    const achievements = calculateAchievements(progress);
    return sendSuccess(res, {
      progress,
      photos,
      achievements,
    });
  } catch (error) {
    next(error);
  }
};

export const recordCheckIn = async (req, res, next) => {
  try {
    const { note, mood } = req.body;
    const progress = await getOrCreateProgress(req.user._id);
    progress.checkIns.push({ note, mood });
    progress.streak = updateStreak(progress);
    progress.achievements = calculateAchievements(progress);
    await progress.save();
    return sendSuccess(res, { progress }, 'Check-in guardado!');
  } catch (error) {
    next(error);
  }
};

export const savePhotoReference = async (req, res, next) => {
  try {
    const { url, caption } = req.body;
    if (!url) {
      return sendError(res, 400, 'Partilha um link ou descrição da foto.');
    }
    const photo = await Photo.create({ user: req.user._id, url, caption });
    return sendSuccess(res, { photo }, 'Foto adicionada ao progresso.');
  } catch (error) {
    next(error);
  }
};
