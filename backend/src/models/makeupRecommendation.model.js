import mongoose from 'mongoose';

const makeupRecommendationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lookType: { type: String, enum: ['natural', 'noite'], required: true },
    base: { type: String },
    concealer: { type: String },
    blush: { type: String },
    eyeshadow: { type: String },
    lipstick: { type: String }
  },
  { timestamps: true }
);

export const MakeupRecommendation = mongoose.model('MakeupRecommendation', makeupRecommendationSchema);
