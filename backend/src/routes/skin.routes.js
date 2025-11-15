import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import {
  createRoutineCheckin,
  generateSkinRoutine,
  getCheckinSummary,
  getSkinProfile,
  getSkinRoutines,
  upsertSkinProfile
} from '../controllers/skin.controller.js';

const router = Router();

router.use(authRequired);

router.post('/profile', upsertSkinProfile);
router.get('/profile', getSkinProfile);
router.post('/routine/generate', generateSkinRoutine);
router.get('/routines', getSkinRoutines);
router.post('/checkin', createRoutineCheckin);
router.get('/checkins/summary', getCheckinSummary);

export default router;
