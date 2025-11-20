import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const nivelSchema = new Schema(
  {
    nivel: Number,
    concluido: { type: Boolean, default: false },
  },
  { _id: false }
);

const moduloProgressoSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    modulo: { type: String, required: true },
    niveis: [nivelSchema],
  },
  { timestamps: true }
);

moduloProgressoSchema.index({ userId: 1, modulo: 1 }, { unique: true });

export default model('ModuloProgresso', moduloProgressoSchema);
