import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const answerSchema = new Schema(
  {
    question: String,
    response: String,
  },
  { _id: false }
);

const skinProfileSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
    skinType: { type: String, default: 'normal' },
    concerns: [{ type: String }],
    answers: [answerSchema],
    diagnosisSummary: { type: String },
    recommendations: [{ type: String }],
  },
  { timestamps: true }
);

export default model('SkinProfile', skinProfileSchema);
