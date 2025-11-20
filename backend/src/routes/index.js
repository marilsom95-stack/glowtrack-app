import { Router } from 'express';
import { sendSuccess } from '../utils/response.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import skinRoutes from './skin.routes.js';
import routineRoutes from './routine.routes.js';
import makeupRoutes from './makeup.routes.js';
import makeupSugestoesRoutes from './makeup.pt.routes.js';
import productRoutes from './product.routes.js';
import lifestyleRoutes from './lifestyle.routes.js';
import progressRoutes from './progress.routes.js';
import diagnosticoRoutes from './diagnostico.routes.js';
import rotinaPtRoutes from './rotina.routes.js';
import glowRoutes from './glow.routes.js';
import progressoRoutes from './progresso.routes.js';
import modulosRoutes from './modulos.routes.js';
import perfilRoutes from './perfil.routes.js';

const router = Router();

router.get('/health', (_req, res) =>
  sendSuccess(res, { status: 'ok' }, 'GlowTrack API saudável')
);

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/skin', skinRoutes);
router.use('/routine', routineRoutes);
router.use('/makeup', makeupRoutes);
router.use('/makeup', makeupSugestoesRoutes);
router.use('/products', productRoutes);
router.use('/lifestyle', lifestyleRoutes);
router.use('/progress', progressRoutes);
router.use('/diagnostico', diagnosticoRoutes);
router.use('/rotina', rotinaPtRoutes);
router.use('/glow', glowRoutes);
router.use('/progresso', progressoRoutes);
router.use('/modulos', modulosRoutes);
router.use('/perfil', perfilRoutes);

export default router;
