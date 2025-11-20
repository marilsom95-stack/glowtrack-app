import SkinProfile from '../models/SkinProfile.js';
import { sendSuccess } from '../utils/response.js';
import {
  diagnosisQuestions,
  deriveSkinType,
  recommendationsForType,
} from '../services/diagnostico.service.js';

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
