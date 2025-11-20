import MakeupSugestao from '../models/MakeupSugestao.js';
import { getMakeupSuggestions } from '../services/makeup.service.js';
import { sendSuccess } from '../utils/response.js';

export const gerarSugestoesMakeup = async (req, res, next) => {
  try {
    const { fotoURL } = req.body;
    const sugestoes = getMakeupSuggestions({ skinType: req.user.skinType });
    const registo = await MakeupSugestao.create({
      userId: req.user._id,
      fotoURL,
      tipoPele: req.user.skinType,
      sugestoes,
    });
    return sendSuccess(res, { sugestoes: registo.sugestoes });
  } catch (error) {
    next(error);
  }
};

export const listarSugestoesMakeup = async (req, res, next) => {
  try {
    const lista = await MakeupSugestao.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, { lista });
  } catch (error) {
    next(error);
  }
};
