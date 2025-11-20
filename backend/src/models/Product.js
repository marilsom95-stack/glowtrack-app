import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    category: {
      type: String,
      enum: ['limpeza', 'hidratação', 'tratamento', 'proteção', 'maquilhagem'],
      alias: 'categoria',
    },
    name: { type: String, required: true, alias: 'nome' },
    description: String,
    skinTypes: [{ type: String, alias: 'tipoPele' }],
    ingredients: [{ type: String, alias: 'ingredientes' }],
    photoURL: { type: String, alias: 'fotoURL' },
    usageTime: { type: String, alias: 'quandoUsar' },
    externalLink: { type: String },
  },
  { timestamps: true }
);

export default model('Product', productSchema);
