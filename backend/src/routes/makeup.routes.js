import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getMakeupMatch } from '../controllers/makeup.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', getMakeupMatch);

export default router;
