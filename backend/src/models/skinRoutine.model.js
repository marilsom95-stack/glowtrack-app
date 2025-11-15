import mongoose from 'mongoose';

const routineStepSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String },
    active: { type: Boolean, default: true }
  },
  { _id: false }
);

const skinRoutineSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    period: { type: String, enum: ['manha', 'noite'], required: true },
    steps: [routineStepSchema]
  },
  { timestamps: true }
);

skinRoutineSchema.index({ userId: 1, period: 1 }, { unique: true });

export const SkinRoutine = mongoose.model('SkinRoutine', skinRoutineSchema);
