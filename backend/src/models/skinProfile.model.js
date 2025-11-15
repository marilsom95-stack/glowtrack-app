import mongoose from 'mongoose';

const skinProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    gender: { type: String },
    ageRange: { type: String },
    skinType: {
      type: String,
      enum: ['seca', 'oleosa', 'mista', 'sensível', 'normal', 'nao_sei'],
      default: 'nao_sei'
    },
    goals: [{ type: String }],
    issues: [{ type: String }],
    usesMakeupDaily: { type: Boolean, default: false },
    sleepsWell: { type: Boolean, default: true }
  },
  { timestamps: true }
);

skinProfileSchema.index({ userId: 1 }, { unique: true });

export const SkinProfile = mongoose.model('SkinProfile', skinProfileSchema);
