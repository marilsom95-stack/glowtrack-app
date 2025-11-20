import Diagnostico from '../models/Diagnostico.js';
import RotinaPlano from '../models/Rotina.js';
import {
  diagnosisQuestions,
  deriveSkinType,
  recommendationsForType,
} from '../services/diagnostico.service.js';
import { buildRoutineTemplate } from '../services/routine.service.js';
import { sendSuccess } from '../utils/response.js';

const formatAnswers = (answers = {}) =>
  diagnosisQuestions.map((question) => ({ question, response: answers[question] || 'não informado' }));

export const listarDiagnosticos = async (req, res, next) => {
  try {
    const ultimo = await Diagnostico.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, { ultimo });
  } catch (error) {
    next(error);
  }
};

export const criarDiagnostico = async (req, res, next) => {
  try {
    const { answers = {}, selfieURL, resultadosIA = {} } = req.body;
    const tipoPele = deriveSkinType(answers);
    const autoAvaliacoes = formatAnswers(answers);
    const diagnostico = await Diagnostico.create({
      userId: req.user._id,
      tipoPele,
      autoAvaliacoes,
      selfieURL,
      resultadosIA,
    });

    const recommendations = recommendationsForType(tipoPele);
    const rotinaBase = buildRoutineTemplate(tipoPele);
    await RotinaPlano.findOneAndUpdate(
      { userId: req.user._id },
      {
        manha: rotinaBase.morning.map((step) => step.name || step),
        noite: rotinaBase.night.map((step) => step.name || step),
        ultimaRegeneracao: new Date(),
      },
      { upsert: true, new: true }
    );

    return sendSuccess(res, { diagnostico, tipoPele, recommendations, autoAvaliacoes });
  } catch (error) {
    next(error);
  }
};

export const obterQuestionario = (_req, res) =>
  sendSuccess(res, { perguntas: diagnosisQuestions });
