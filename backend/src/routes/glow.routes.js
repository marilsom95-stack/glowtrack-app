import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { registarAgua, registarTreino, registarHumor } from '../controllers/glow.controller.js';

const router = Router();

router.use(authenticate);
router.post('/agua', registarAgua);
router.post('/treino', registarTreino);
router.post('/humor', registarHumor);

export default router;
