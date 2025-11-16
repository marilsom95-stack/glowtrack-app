import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { getProducts } from '../controllers/product.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', getProducts);

export default router;
