import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  completeRoutineStep,
  getDailyRoutine,
} from '../controllers/routine.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', getDailyRoutine);
router.post('/complete', completeRoutineStep);

export default router;
