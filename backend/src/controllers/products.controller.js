import { ProductRecommendation } from '../models/productRecommendation.model.js';
import { sendError, sendSuccess } from '../utils/response.js';

export const listProductRecommendations = async (req, res) => {
  try {
    const { category, skinType, when } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (when) filter.whenToUse = when;
    if (skinType) {
      filter.$or = [
        { skinType: skinType },
        { skinType: { $in: [skinType] } },
        { skinType: { $exists: false } }
      ];
    }

    const recommendations = await ProductRecommendation.find(filter).sort({ createdAt: -1 });
    return sendSuccess(res, { recommendations });
  } catch (error) {
    return sendError(res, 500, 'Failed to fetch product recommendations', { error: error.message });
  }
};

export const createProductRecommendation = async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.userId) {
      payload.userId = req.userId;
    }
    const recommendation = await ProductRecommendation.create(payload);
    return sendSuccess(res, { recommendation }, 'Product recommendation saved');
  } catch (error) {
    return sendError(res, 500, 'Failed to save product recommendation', { error: error.message });
  }
};
