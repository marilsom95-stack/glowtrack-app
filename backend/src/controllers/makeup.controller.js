import { MakeupProfile } from '../models/makeupProfile.model.js';
import { MakeupRecommendation } from '../models/makeupRecommendation.model.js';
import { sendError, sendSuccess } from '../utils/response.js';

const buildMakeupRecommendation = (profile, lookType) => {
  const tone = profile.skinTone || 'pele equilibrada';
  const preference = profile.preferences?.[0] || (lookType === 'noite' ? 'impactante' : 'natural');

  const base = tone.includes('escura')
    ? 'Base com acabamento luminoso que respeita o subtom e realça o glow natural.'
    : 'Base leve e construída em camadas para uniformizar sem pesar.';

  const concealer = lookType === 'noite'
    ? 'Corretor de alta cobertura para zonas específicas e durabilidade extra.'
    : 'Corretor fluido para iluminar e suavizar olheiras.';

  const blush = preference === 'natural'
    ? 'Blush em creme tom pêssego para um efeito saudável.'
    : 'Blush em pó com brilho suave para eventos especiais.';

  const eyeshadow = lookType === 'noite'
    ? 'Esfumado bronze ou grafite fácil de aplicar, combinado com máscara de pestanas.'
    : 'Sombra nude acetinada apenas para definir o olhar.';

  const lipstick = preference === 'natural'
    ? 'Bálsamo com cor que hidrata e adiciona leve tonalidade.'
    : 'Batom mate confortável em tons intensos para destacar os lábios.';

  return { base, concealer, blush, eyeshadow, lipstick };
};

export const upsertMakeupProfile = async (req, res) => {
  try {
    const profile = await MakeupProfile.findOneAndUpdate(
      { userId: req.userId },
      { ...req.body, userId: req.userId },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return sendSuccess(res, { profile }, 'Perfil de maquilhagem atualizado');
  } catch (error) {
    return sendError(res, 500, 'Failed to save makeup profile', { error: error.message });
  }
};

export const getMakeupProfile = async (req, res) => {
  try {
    const profile = await MakeupProfile.findOne({ userId: req.userId });
    if (!profile) {
      return sendError(res, 404, 'Perfil de maquilhagem não encontrado');
    }
    return sendSuccess(res, { profile });
  } catch (error) {
    return sendError(res, 500, 'Failed to fetch makeup profile', { error: error.message });
  }
};

export const generateMakeupRecommendation = async (req, res) => {
  try {
    const { lookType = 'natural' } = req.body;
    const profile = await MakeupProfile.findOne({ userId: req.userId });
    if (!profile) {
      return sendError(res, 404, 'Complete o perfil de maquilhagem antes de gerar recomendações');
    }

    const recommendationData = buildMakeupRecommendation(profile, lookType);
    const recommendation = await MakeupRecommendation.create({
      userId: req.userId,
      lookType,
      ...recommendationData
    });

    return sendSuccess(res, { recommendation }, 'Recomendação criada');
  } catch (error) {
    return sendError(res, 500, 'Failed to create recommendation', { error: error.message });
  }
};

export const listMakeupRecommendations = async (req, res) => {
  try {
    const recommendations = await MakeupRecommendation.find({ userId: req.userId }).sort({ createdAt: -1 });
    return sendSuccess(res, { recommendations });
  } catch (error) {
    return sendError(res, 500, 'Failed to list recommendations', { error: error.message });
  }
};
