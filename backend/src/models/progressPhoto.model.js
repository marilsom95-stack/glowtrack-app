import mongoose from 'mongoose';

const progressPhotoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    imageUrl: { type: String, required: true },
    note: { type: String }
  },
  { timestamps: true }
);

export const ProgressPhoto = mongoose.model('ProgressPhoto', progressPhotoSchema);
