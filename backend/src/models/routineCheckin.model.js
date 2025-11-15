import mongoose from 'mongoose';

const routineCheckinSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    period: { type: String, enum: ['manha', 'noite'], required: true },
    completedSteps: { type: Number, default: 0 },
    totalSteps: { type: Number, default: 0 }
  },
  { timestamps: true }
);

routineCheckinSchema.index({ userId: 1, date: 1, period: 1 }, { unique: true });

export const RoutineCheckin = mongoose.model('RoutineCheckin', routineCheckinSchema);
