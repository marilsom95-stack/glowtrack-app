import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const makeupSugestaoSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fotoURL: String,
    tipoPele: String,
    sugestoes: [{ type: String }],
  },
  { timestamps: true }
);

export default model('MakeupSugestao', makeupSugestaoSchema);
