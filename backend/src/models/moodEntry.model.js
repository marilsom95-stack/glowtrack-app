import mongoose from 'mongoose';

const moodEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    mood: { type: String, required: true },
    note: { type: String }
  },
  { timestamps: true }
);

moodEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

export const MoodEntry = mongoose.model('MoodEntry', moodEntrySchema);
