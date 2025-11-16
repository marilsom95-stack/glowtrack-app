import SkinProfile from '../models/SkinProfile.js';
import { sendSuccess } from '../utils/response.js';

const diagnosisQuestions = [
  'A tua pele brilha durante o dia?',
  'Sentes a pele a repuxar?',
  'Tens acne/pontos negros?',
  'Usas maquilhagem todos os dias?',
  'Dormes bem?'
];

const deriveSkinType = (answers = {}) => {
  const shines = answers['A tua pele brilha durante o dia?'] === 'sim';
  const tight = answers['Sentes a pele a repuxar?'] === 'sim';
  const acne = answers['Tens acne/pontos negros?'] === 'sim';
  if (shines && acne) return 'oleosa';
  if (tight) return 'seca';
  if (!shines && answers['Dormes bem?'] === 'não') return 'sensível';
  if (!shines && !acne) return 'normal';
  return 'mista';
};

const recommendationsForType = (type) => {
  switch (type) {
    case 'oleosa':
      return [
        'Opta por texturas leves e não comedogénicas.',
        'Inclui ácido salicílico 2x por semana.',
      ];
    case 'seca':
      return ['Hidratação rica com ceramidas.', 'Evita espumas agressivas.'];
    case 'sensível':
      return ['Usa produtos sem perfume.', 'Aplica SPF mesmo em casa.'];
    case 'mista':
      return ['Equilibra zonas com séruns diferentes.', 'Faz dupla limpeza à noite.'];
    default:
      return ['Mantém rotina equilibrada.', 'Prioriza SPF diário.'];
  }
};

export const saveOnboarding = async (req, res, next) => {
  try {
    const { gender, age, skinType, goals = [] } = req.body;
    const profile = await SkinProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        skinType: skinType || req.user.skinType,
        concerns: goals,
      },
      { new: true, upsert: true }
    );
    if (gender || age || skinType || goals.length) {
      const { default: User } = await import('../models/User.js');
      await User.findByIdAndUpdate(req.user._id, {
        gender,
        age,
        skinType: skinType || req.user.skinType,
        goals,
      });
    }
    return sendSuccess(res, { profile }, 'Onboarding guardado.');
  } catch (error) {
    next(error);
  }
};

export const runDiagnosis = async (req, res, next) => {
  try {
    const { answers = {} } = req.body;
    diagnosisQuestions.forEach((question) => {
      if (!answers[question]) {
        answers[question] = 'não informado';
      }
    });
    const skinType = deriveSkinType(answers);
    const recommendations = recommendationsForType(skinType);
    const formattedAnswers = diagnosisQuestions.map((question) => ({
      question,
      response: answers[question],
    }));

    const profile = await SkinProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        skinType,
        answers: formattedAnswers,
        diagnosisSummary: `A tua pele foi classificada como ${skinType}.`,
        recommendations,
      },
      { new: true, upsert: true }
    );

    return sendSuccess(res, { skinType, recommendations, profile });
  } catch (error) {
    next(error);
  }
};

export const getDiagnosisQuestions = (_req, res) => {
  return sendSuccess(res, { questions: diagnosisQuestions });
};
