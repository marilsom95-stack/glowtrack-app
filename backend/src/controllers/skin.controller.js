import { SkinProfile } from '../models/skinProfile.model.js';
import { SkinRoutine } from '../models/skinRoutine.model.js';
import { RoutineCheckin } from '../models/routineCheckin.model.js';
import { sendError, sendSuccess } from '../utils/response.js';

const normalizeDate = (value = new Date()) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const buildRoutineSteps = (profile, period) => {
  const steps = [];
  const { skinType, goals = [], usesMakeupDaily } = profile;

  const primaryGoal = goals[0];

  const addStep = (name, description) => {
    steps.push({ name, description, active: true });
  };

  if (period === 'manha') {
    addStep('Limpeza suave', 'Remove impurezas sem agredir a barreira da pele.');
    if (skinType === 'oleosa' || goals.includes('oleosidade')) {
      addStep('Tónico equilibrante', 'Controla brilho e prepara a pele para os próximos passos.');
    }
    if (primaryGoal === 'acne') {
      addStep('Sérum purificante', 'Ingrediente leve com foco em pontos de acne.');
    } else if (primaryGoal === 'hidratar') {
      addStep('Sérum hidratante', 'Com ácido hialurónico ou ingredientes calmantes.');
    }
    addStep(
      skinType === 'sensível' ? 'Hidratante calmante' : 'Hidratante leve',
      skinType === 'sensível'
        ? 'Textura rica e sem fragrância para proteger a pele sensível.'
        : 'Reforça hidratação e mantém o conforto durante o dia.'
    );
    addStep('Protetor solar', 'FPS 30+ todos os dias, mesmo com céu nublado.');
  } else {
    addStep('Limpeza', 'Remove impurezas e prepara a pele para se regenerar à noite.');
    if (usesMakeupDaily) {
      addStep('Dupla limpeza', 'Óleo ou bálsamo para remover maquilhagem por completo.');
    }
    if (skinType !== 'sensível') {
      if (primaryGoal === 'acne') {
        addStep('Tratamento localizado', 'Aplicar ingredientes anti-imperfeições nas zonas críticas.');
      } else if (primaryGoal === 'hidratar') {
        addStep('Máscara ou sérum nutritivo', 'Camada extra de hidratação antes do hidratante.');
      } else {
        addStep('Essência equilibrante', 'Ajuda a pele a renovar durante a noite.');
      }
    } else {
      addStep('Sérum calmante', 'Texturas leves e sem ácidos fortes para evitar irritação.');
    }
    addStep('Hidratante noturno', 'Fórmula rica para selar todos os ativos.');
  }

  return steps.map((step, index) => ({ order: index + 1, ...step }));
};

const computeStreak = (dayKeys) => {
  if (!dayKeys.length) return { currentStreak: 0, longestStreak: 0 };
  const sorted = [...dayKeys]
    .map((key) => new Date(key))
    .sort((a, b) => a.getTime() - b.getTime());

  let longest = 0;
  let current = 0;
  let prevDate = null;

  sorted.forEach((date) => {
    if (prevDate) {
      const diff = date.getTime() - prevDate.getTime();
      if (diff <= 24 * 60 * 60 * 1000) {
        current += 1;
      } else {
        current = 1;
      }
    } else {
      current = 1;
    }
    prevDate = date;
    longest = Math.max(longest, current);
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastDate = sorted[sorted.length - 1];
  const diffFromToday = today.getTime() - lastDate.getTime();
  const currentStreak = diffFromToday <= 24 * 60 * 60 * 1000 ? current : 0;

  return { currentStreak, longestStreak: longest };
};

export const upsertSkinProfile = async (req, res) => {
  try {
    const profile = await SkinProfile.findOneAndUpdate(
      { userId: req.userId },
      { ...req.body, userId: req.userId },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return sendSuccess(res, { profile }, 'Skin profile updated');
  } catch (error) {
    return sendError(res, 500, 'Failed to save skin profile', { error: error.message });
  }
};

export const getSkinProfile = async (req, res) => {
  try {
    const profile = await SkinProfile.findOne({ userId: req.userId });
    if (!profile) {
      return sendError(res, 404, 'Skin profile not found');
    }
    return sendSuccess(res, { profile }, 'Skin profile');
  } catch (error) {
    return sendError(res, 500, 'Failed to fetch skin profile', { error: error.message });
  }
};

export const generateSkinRoutine = async (req, res) => {
  try {
    const profile = await SkinProfile.findOne({ userId: req.userId });
    if (!profile) {
      return sendError(res, 404, 'Complete o diagnóstico de pele antes de gerar rotinas.');
    }

    const periods = ['manha', 'noite'];
    const routines = [];

    for (const period of periods) {
      const steps = buildRoutineSteps(profile, period);
      const routine = await SkinRoutine.findOneAndUpdate(
        { userId: req.userId, period },
        { steps },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      routines.push(routine);
    }

    return sendSuccess(res, { routines }, 'Rotinas de pele atualizadas');
  } catch (error) {
    return sendError(res, 500, 'Failed to generate routines', { error: error.message });
  }
};

export const getSkinRoutines = async (req, res) => {
  try {
    const routines = await SkinRoutine.find({ userId: req.userId }).sort({ period: 1 });
    return sendSuccess(res, { routines }, 'Skin routines');
  } catch (error) {
    return sendError(res, 500, 'Failed to fetch routines', { error: error.message });
  }
};

export const createRoutineCheckin = async (req, res) => {
  try {
    const { period, completedSteps = 0, totalSteps = 0, date } = req.body;
    if (!['manha', 'noite'].includes(period)) {
      return sendError(res, 422, 'Período inválido');
    }

    const normalizedDate = normalizeDate(date ? new Date(date) : new Date());
    const checkin = await RoutineCheckin.findOneAndUpdate(
      { userId: req.userId, period, date: normalizedDate },
      { completedSteps, totalSteps },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return sendSuccess(res, { checkin }, 'Check-in registado');
  } catch (error) {
    return sendError(res, 500, 'Failed to save check-in', { error: error.message });
  }
};

export const getCheckinSummary = async (req, res) => {
  try {
    const checkins = await RoutineCheckin.find({ userId: req.userId }).sort({ date: 1 });
    const daySummary = new Map();

    checkins.forEach((entry) => {
      const key = entry.date.toISOString().split('T')[0];
      const summary = daySummary.get(key) || { completed: 0, total: 0 };
      summary.completed += entry.completedSteps;
      summary.total += entry.totalSteps;
      daySummary.set(key, summary);
    });

    const completedDays = Array.from(daySummary.entries())
      .filter(([, summary]) => summary.total > 0 && summary.completed >= summary.total)
      .map(([key]) => key);

    const streakInfo = computeStreak(completedDays);

    return sendSuccess(res, {
      totalCheckins: checkins.length,
      daysTracked: daySummary.size,
      daysCompleted: completedDays.length,
      streak: streakInfo
    });
  } catch (error) {
    return sendError(res, 500, 'Failed to summarize check-ins', { error: error.message });
  }
};
