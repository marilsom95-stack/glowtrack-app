import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import {
  addProgressPhoto,
  getProgressPhotos,
  getProgressSummary
} from '../controllers/progress.controller.js';

const router = Router();

router.use(authRequired);

router.post('/photos', addProgressPhoto);
router.get('/photos', getProgressPhotos);
router.get('/summary', getProgressSummary);

export default router;
