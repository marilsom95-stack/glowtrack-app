import { Router } from 'express';
import { appleCallbackHandler, googleCallbackHandler } from '../controllers/oauth.controller.js';
import { sendSuccess } from '../utils/response.js';

const router = Router();

router.get('/google', (req, res) => {
  return sendSuccess(res, { message: 'Google OAuth start (placeholder)' });
});

router.get('/google/callback', googleCallbackHandler);

router.get('/apple', (req, res) => {
  return sendSuccess(res, { message: 'Apple OAuth start (placeholder)' });
});

router.route('/apple/callback').get(appleCallbackHandler).post(appleCallbackHandler);

export default router;
