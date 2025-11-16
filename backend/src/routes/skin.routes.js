import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  getDiagnosisQuestions,
  runDiagnosis,
  saveOnboarding,
} from '../controllers/skin.controller.js';

const router = Router();

router.use(authenticate);
router.get('/questions', getDiagnosisQuestions);
router.post('/onboarding', saveOnboarding);
router.post('/diagnosis', runDiagnosis);

export default router;
