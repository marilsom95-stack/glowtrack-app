import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import { createMoodEntry, getRecentMoodEntries } from '../controllers/mood.controller.js';

const router = Router();

router.use(authRequired);

router.post('/', createMoodEntry);
router.get('/recent', getRecentMoodEntries);

export default router;
