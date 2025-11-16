import Routine from '../models/Routine.js';
import { sendError, sendSuccess } from '../utils/response.js';
import { buildRoutineTemplate, snapshotSteps } from '../services/routine.service.js';

const upsertRoutine = async (userId, period, skinType) => {
  const template = buildRoutineTemplate(skinType)[period];
  let routine = await Routine.findOne({ user: userId, period });
  if (!routine) {
    routine = await Routine.create({ user: userId, period, steps: template });
  } else if (routine.steps.length !== template.length) {
    routine.steps = template;
    await routine.save();
  }
  return routine;
};

export const getDailyRoutine = async (req, res, next) => {
  try {
    const skinType = req.user.skinType || 'normal';
    const morningRoutine = await upsertRoutine(req.user._id, 'morning', skinType);
    const nightRoutine = await upsertRoutine(req.user._id, 'night', skinType);
    return sendSuccess(res, {
      morning: morningRoutine,
      night: nightRoutine,
    });
  } catch (error) {
    next(error);
  }
};

export const completeRoutineStep = async (req, res, next) => {
  try {
    const { period, stepName } = req.body;
    if (!period || !stepName) {
      return sendError(res, 400, 'Indica o período e o passo concluído.');
    }
    const routine = await Routine.findOne({ user: req.user._id, period });
    if (!routine) {
      return sendError(res, 404, 'Rotina não encontrada.');
    }
    routine.steps = routine.steps.map((step) => {
      const current = step.toObject ? step.toObject() : step;
      if (current.name === stepName) {
        current.completed = true;
      }
      return current;
    });
    routine.history.push({ date: new Date(), steps: snapshotSteps(routine.steps) });
    await routine.save();
    return sendSuccess(res, { routine }, 'Passo concluído!');
  } catch (error) {
    next(error);
  }
};
