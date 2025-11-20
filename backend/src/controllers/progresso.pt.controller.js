import Progress from '../models/Progress.js';
import ProgressoFoto from '../models/ProgressoFoto.js';
import { sendError, sendSuccess } from '../utils/response.js';
import { calculateAchievements, updateStreak } from '../services/progress.service.js';

const obterProgresso = async (userId) => {
  const existente = await Progress.findOne({ user: userId });
  if (existente) return existente;
  return Progress.create({ user: userId });
};

export const guardarFoto = async (req, res, next) => {
  try {
    const { fotoURL } = req.body;
    if (!fotoURL) return sendError(res, 400, 'Partilha a tua foto.');
    const foto = await ProgressoFoto.create({ userId: req.user._id, fotoURL });
    return sendSuccess(res, { foto }, 'Foto de progresso guardada.');
  } catch (error) {
    next(error);
  }
};

export const listarProgresso = async (req, res, next) => {
  try {
    const progresso = await obterProgresso(req.user._id);
    const fotos = await ProgressoFoto.find({ userId: req.user._id }).sort({ createdAt: -1 });
    const conquistas = calculateAchievements(progresso);
    return sendSuccess(res, { progresso, fotos, conquistas });
  } catch (error) {
    next(error);
  }
};

export const registarCheckin = async (req, res, next) => {
  try {
    const progresso = await obterProgresso(req.user._id);
    progresso.checkIns.push({ mood: req.body.mood, note: req.body.note });
    progresso.streak = updateStreak(progresso);
    progresso.achievements = calculateAchievements(progresso);
    await progresso.save();
    return sendSuccess(res, { progresso }, 'Check-in guardado.');
  } catch (error) {
    next(error);
  }
};
