import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const stepSchema = new Schema(
  {
    name: String,
    description: String,
    idealSkinTypes: [{ type: String }],
    completed: { type: Boolean, default: false },
  },
  { _id: false }
);

const historySchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    steps: [stepSchema],
  },
  { _id: false }
);

const routineSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    period: { type: String, enum: ['morning', 'night'] },
    steps: [stepSchema],
    history: [historySchema],
  },
  { timestamps: true }
);

export default model('Routine', routineSchema);
