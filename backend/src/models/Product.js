import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    category: {
      type: String,
      enum: ['limpeza', 'hidratação', 'tratamento', 'proteção', 'maquilhagem'],
    },
    name: { type: String, required: true },
    description: String,
    skinTypes: [{ type: String }],
    usageTime: { type: String },
    externalLink: { type: String },
  },
  { timestamps: true }
);

export default model('Product', productSchema);
