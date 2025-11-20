import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const progressoFotoSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    data: { type: Date, default: Date.now },
    fotoURL: { type: String, required: true },
  },
  { timestamps: true }
);

export default model('ProgressoFoto', progressoFotoSchema);
