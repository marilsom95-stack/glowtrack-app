import Checkin from '../models/Checkin.js';
import { sendSuccess } from '../utils/response.js';

const obterCheckinAtual = async (userId) => {
  const hoje = new Date();
  const inicioDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const existente = await Checkin.findOne({ userId, data: { $gte: inicioDia } });
  return existente || (await Checkin.create({ userId, data: inicioDia }));
};

export const registarAgua = async (req, res, next) => {
  try {
    const { quantidade = 250 } = req.body;
    const checkin = await obterCheckinAtual(req.user._id);
    checkin.aguaMl += quantidade;
    await checkin.save();
    return sendSuccess(res, { checkin }, 'Hidratação registada.');
  } catch (error) {
    next(error);
  }
};

export const registarTreino = async (req, res, next) => {
  try {
    const checkin = await obterCheckinAtual(req.user._id);
    checkin.treinoFeito = true;
    await checkin.save();
    return sendSuccess(res, { checkin }, 'Treino concluído.');
  } catch (error) {
    next(error);
  }
};

export const registarHumor = async (req, res, next) => {
  try {
    const { humor } = req.body;
    const checkin = await obterCheckinAtual(req.user._id);
    checkin.humor = humor;
    await checkin.save();
    return sendSuccess(res, { checkin }, 'Humor registado.');
  } catch (error) {
    next(error);
  }
};
