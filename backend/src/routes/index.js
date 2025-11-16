import { Router } from 'express';
import { sendSuccess } from '../utils/response.js';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import skinRoutes from './skin.routes.js';
import routineRoutes from './routine.routes.js';
import makeupRoutes from './makeup.routes.js';
import productRoutes from './product.routes.js';
import lifestyleRoutes from './lifestyle.routes.js';
import progressRoutes from './progress.routes.js';

const router = Router();

router.get('/health', (_req, res) =>
  sendSuccess(res, { status: 'ok' }, 'GlowTrack API saudável')
);

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/skin', skinRoutes);
router.use('/routine', routineRoutes);
router.use('/makeup', makeupRoutes);
router.use('/products', productRoutes);
router.use('/lifestyle', lifestyleRoutes);
router.use('/progress', progressRoutes);

export default router;
