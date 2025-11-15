import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import {
  createProductRecommendation,
  listProductRecommendations
} from '../controllers/products.controller.js';

const router = Router();

router.use(authRequired);

router.get('/recommendations', listProductRecommendations);
router.post('/recommendations', createProductRecommendation);

export default router;
