import RotinaPlano from '../models/Rotina.js';
import Checkin from '../models/Checkin.js';
import { buildRoutineTemplate } from '../services/routine.service.js';
import { sendSuccess } from '../utils/response.js';

const passosManha = ['Limpeza', 'Tónico', 'Sérum', 'Hidratante', 'FPS'];
const passosNoite = ['Limpeza dupla', 'Tratamento', 'Sérum / ácido', 'Creme noturno'];

const baseRotina = (skinType = 'normal') => {
  const template = buildRoutineTemplate(skinType);
  return {
    manha: template.morning.map((step) => step.name || step),
    noite: template.night.map((step) => step.name || step),
  };
};

const getOuCriaRotina = async (userId, skinType) => {
  const existente = await RotinaPlano.findOne({ userId });
  if (existente) return existente;
  const template = baseRotina(skinType);
  return RotinaPlano.create({ userId, ...template, ultimaRegeneracao: new Date() });
};

const obterCheckinAtual = async (userId) => {
  const hoje = new Date();
  const inicioDia = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const existente = await Checkin.findOne({ userId, data: { $gte: inicioDia } });
  return existente || (await Checkin.create({ userId, data: inicioDia }));
};

export const obterRotina = async (req, res, next) => {
  try {
    const rotina = await getOuCriaRotina(req.user._id, req.user.skinType);
    const checkin = await obterCheckinAtual(req.user._id);
    return sendSuccess(res, {
      rotina,
      passosSugestao: { manha: passosManha, noite: passosNoite },
      checkin,
    });
  } catch (error) {
    next(error);
  }
};

export const regenerarRotina = async (req, res, next) => {
  try {
    const rotinaGerada = baseRotina(req.user.skinType);
    const rotina = await RotinaPlano.findOneAndUpdate(
      { userId: req.user._id },
      { ...rotinaGerada, ultimaRegeneracao: new Date() },
      { new: true, upsert: true }
    );
    return sendSuccess(res, { rotina }, 'Rotina regenerada com sucesso.');
  } catch (error) {
    next(error);
  }
};

export const concluirRotina = async (req, res, next) => {
  try {
    const { periodo } = req.body;
    const checkin = await obterCheckinAtual(req.user._id);
    if (periodo === 'manha') checkin.manhaConcluido = true;
    if (periodo === 'noite') checkin.noiteConcluido = true;
    await checkin.save();
    return sendSuccess(res, { checkin }, 'Check-in registado.');
  } catch (error) {
    next(error);
  }
};
