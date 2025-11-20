import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { gerarSugestoesMakeup, listarSugestoesMakeup } from '../controllers/makeup.pt.controller.js';

const router = Router();

router.use(authenticate);
router.post('/', gerarSugestoesMakeup);
router.get('/sugestoes', listarSugestoesMakeup);

export default router;
