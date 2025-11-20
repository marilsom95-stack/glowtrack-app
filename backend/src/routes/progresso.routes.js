import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { guardarFoto, listarProgresso, registarCheckin } from '../controllers/progresso.pt.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', listarProgresso);
router.post('/foto', guardarFoto);
router.post('/checkin', registarCheckin);

export default router;
