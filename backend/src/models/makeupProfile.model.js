import mongoose from 'mongoose';

const makeupProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skinType: { type: String },
    skinTone: { type: String },
    preferences: [{ type: String }],
    notes: { type: String }
  },
  { timestamps: true }
);

makeupProfileSchema.index({ userId: 1 }, { unique: true });

export const MakeupProfile = mongoose.model('MakeupProfile', makeupProfileSchema);
