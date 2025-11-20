import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { concluirRotina, obterRotina, regenerarRotina } from '../controllers/rotina.pt.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', obterRotina);
router.post('/regenerar', regenerarRotina);
router.post('/checkin', concluirRotina);

export default router;
