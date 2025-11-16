import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  getProgressOverview,
  recordCheckIn,
  savePhotoReference,
} from '../controllers/progress.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', getProgressOverview);
router.post('/check-in', recordCheckIn);
router.post('/photos', savePhotoReference);

export default router;
