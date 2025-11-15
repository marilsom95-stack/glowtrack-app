import mongoose from 'mongoose';

const productRecommendationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: {
      type: String,
      enum: ['limpeza', 'hidratação', 'tratamento', 'proteção', 'maquilhagem'],
      required: true
    },
    skinType: { type: mongoose.Schema.Types.Mixed },
    name: { type: String, required: true },
    whenToUse: { type: String, enum: ['manha', 'noite', 'ambos'], required: true },
    description: { type: String },
    externalLink: { type: String }
  },
  { timestamps: true }
);

export const ProductRecommendation = mongoose.model('ProductRecommendation', productRecommendationSchema);
