import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import {
  getLifestyle,
  saveWellbeingEntry,
  trackWater,
} from '../controllers/lifestyle.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', getLifestyle);
router.post('/water', trackWater);
router.post('/wellbeing', saveWellbeingEntry);

export default router;
