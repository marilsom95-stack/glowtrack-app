import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const rotinaSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    manha: [{ type: String }],
    noite: [{ type: String }],
    ultimaRegeneracao: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default model('RotinaPlano', rotinaSchema);
