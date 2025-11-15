import mongoose from 'mongoose';

const lifestyleLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    waterMl: { type: Number, default: 0 },
    healthyMeals: { type: Number, default: 0 },
    exerciseDone: { type: Boolean, default: false },
    notes: { type: String }
  },
  { timestamps: true }
);

lifestyleLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const LifestyleLog = mongoose.model('LifestyleLog', lifestyleLogSchema);
