import ModuloProgresso from '../models/ModuloProgresso.js';
import { sendSuccess } from '../utils/response.js';

const moduloNiveis = [
  'Face Yoga',
  'Gua Sha',
  'Skincare',
  'Alimentação',
  'Água',
  'Sono',
  'Motivação',
  'GlowScore',
];

const buildLevels = () =>
  Array.from({ length: 10 }, (_, index) => ({
    nivel: index + 1,
    nome: `Nível ${index + 1}`,
    video: 'https://placehold.co/320x180',
    instrucoes: 'Pratica diária rápida focada no glow.',
    objetivo: 'Consolidar hábitos e técnica.',
    duracao: '5 min',
    concluido: false,
  }));

const mapProgress = async (userId) => {
  const progressDocs = await ModuloProgresso.find({ userId });
  const progressByModule = progressDocs.reduce((acc, item) => {
    acc[item.modulo] = item.niveis;
    return acc;
  }, {});
  return moduloNiveis.map((modulo) => ({
    nome: modulo,
    niveis: buildLevels().map((nivel) => ({
      ...nivel,
      concluido: progressByModule[modulo]?.find((n) => n.nivel === nivel.nivel)?.concluido || false,
    })),
  }));
};

export const listarModulos = async (req, res, next) => {
  try {
    const modulos = await mapProgress(req.user._id);
    return sendSuccess(res, { modulos });
  } catch (error) {
    next(error);
  }
};

export const concluirNivel = async (req, res, next) => {
  try {
    const { modulo, nivel } = req.body;
    if (!modulo || !nivel) {
      return res.status(400).json({ message: 'Indica módulo e nível' });
    }
    const niveis = buildLevels().map((item) => ({ nivel: item.nivel, concluido: item.nivel === nivel }));
    const progresso = await ModuloProgresso.findOneAndUpdate(
      { userId: req.user._id, modulo },
      { niveis },
      { upsert: true, new: true }
    );
    return sendSuccess(res, { progresso }, 'Nível concluído!');
  } catch (error) {
    next(error);
  }
};
