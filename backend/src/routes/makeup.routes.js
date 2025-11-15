import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import {
  generateMakeupRecommendation,
  getMakeupProfile,
  listMakeupRecommendations,
  upsertMakeupProfile
} from '../controllers/makeup.controller.js';

const router = Router();

router.use(authRequired);

router.post('/profile', upsertMakeupProfile);
router.get('/profile', getMakeupProfile);
router.post('/recommendations', generateMakeupRecommendation);
router.get('/recommendations', listMakeupRecommendations);

export default router;
