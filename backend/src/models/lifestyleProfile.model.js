import mongoose from 'mongoose';

const lifestyleProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    waterGoalMl: { type: Number, default: 2000 },
    exerciseFrequencyGoal: { type: String },
    focusFoods: [{ type: String }]
  },
  { timestamps: true }
);

lifestyleProfileSchema.index({ userId: 1 }, { unique: true });

export const LifestyleProfile = mongoose.model('LifestyleProfile', lifestyleProfileSchema);
