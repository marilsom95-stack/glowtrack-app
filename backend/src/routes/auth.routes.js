import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/auth.js';

const router = Router();

const emailValidation = body('email').isEmail().withMessage('Valid email is required');
const passwordValidation = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters long');

router.post(
  '/register',
  [body('name').notEmpty().withMessage('Name is required'), emailValidation, passwordValidation],
  register
);

router.post('/login', [emailValidation, passwordValidation], login);

router.get('/me', authRequired, getProfile);

export default router;
