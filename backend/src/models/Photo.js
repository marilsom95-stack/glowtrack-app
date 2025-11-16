import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const photoSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    url: { type: String, required: true },
    caption: { type: String },
    takenAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model('Photo', photoSchema);
