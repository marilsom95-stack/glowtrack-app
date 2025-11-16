import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const waterLogSchema = new Schema(
  {
    date: { type: Date, default: Date.now },
    cups: { type: Number, default: 0 },
  },
  { _id: false }
);

const wellbeingSchema = new Schema(
  {
    mood: String,
    note: String,
    quote: String,
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const lifestyleSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
    waterGoal: { type: Number, default: 8 },
    waterLogs: [waterLogSchema],
    wellbeingEntries: [wellbeingSchema],
  },
  { timestamps: true }
);

export default model('Lifestyle', lifestyleSchema);
