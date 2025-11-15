import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import {
  getLifestyleProfile,
  getLifestyleSummary,
  getTodayLifestyleLog,
  logTodayLifestyle,
  upsertLifestyleProfile
} from '../controllers/lifestyle.controller.js';

const router = Router();

router.use(authRequired);

router.post('/profile', upsertLifestyleProfile);
router.get('/profile', getLifestyleProfile);
router.post('/log/today', logTodayLifestyle);
router.get('/log/today', getTodayLifestyleLog);
router.get('/log/summary', getLifestyleSummary);

export default router;
