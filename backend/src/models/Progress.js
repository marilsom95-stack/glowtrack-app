import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const checkInSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    note: String,
    mood: String,
  },
  { _id: false }
);

const progressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
    streak: { type: Number, default: 0 },
    checkIns: [checkInSchema],
    achievements: [{ type: String }],
  },
  { timestamps: true }
);

export default model('Progress', progressSchema);
