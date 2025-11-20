import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { concluirNivel, listarModulos } from '../controllers/modulos.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', listarModulos);
router.post('/nivel/concluir', concluirNivel);

export default router;
