import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const checkinSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    data: { type: Date, default: Date.now },
    manhaConcluido: { type: Boolean, default: false },
    noiteConcluido: { type: Boolean, default: false },
    aguaMl: { type: Number, default: 0 },
    treinoFeito: { type: Boolean, default: false },
    humor: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

checkinSchema.index({ userId: 1, data: 1 });

export default model('Checkin', checkinSchema);
