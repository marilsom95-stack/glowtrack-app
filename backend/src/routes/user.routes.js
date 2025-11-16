import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getCurrentUser, updatePreferences } from '../controllers/user.controller.js';

const router = Router();

router.use(authenticate);
router.get('/me', getCurrentUser);
router.put('/preferences', updatePreferences);

export default router;
