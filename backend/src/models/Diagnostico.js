import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const resultadosSchema = new Schema(
  {
    textura: String,
    poros: String,
    oleosidade: String,
    manchas: String,
    linhaT: String,
    secura: String,
    olheiras: String,
  },
  { _id: false }
);

const diagnosticoSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    data: { type: Date, default: Date.now },
    tipoPele: String,
    autoAvaliacoes: [{ question: String, response: String }],
    selfieURL: String,
    resultadosIA: resultadosSchema,
  },
  { timestamps: true }
);

export default model('Diagnostico', diagnosticoSchema);
