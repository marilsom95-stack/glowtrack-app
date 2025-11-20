import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { criarDiagnostico, listarDiagnosticos, obterQuestionario } from '../controllers/diagnostico.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', listarDiagnosticos);
router.get('/perguntas', obterQuestionario);
router.post('/', criarDiagnostico);

export default router;
