import Product from '../models/Product.js';
import { sendSuccess } from '../utils/response.js';

const seedProducts = [
  {
    category: 'limpeza',
    name: 'Gel Purificante Calmante',
    description: 'Remove impurezas sem agredir a barreira cutânea.',
    skinTypes: ['oleosa', 'mista'],
    usageTime: 'manhã e noite',
    externalLink: 'https://example.com/gel-purificante',
  },
  {
    category: 'hidratação',
    name: 'Creme Nuvem com Ácido Hialurónico',
    description: 'Textura leve que hidrata durante 24h.',
    skinTypes: ['normal', 'seca'],
    usageTime: 'manhã',
    externalLink: 'https://example.com/creme-nuvem',
  },
  {
    category: 'tratamento',
    name: 'Sérum Glow com Vitamina C',
    description: 'Uniformiza o tom e potencia o brilho.',
    skinTypes: ['todas'],
    usageTime: 'manhã',
    externalLink: 'https://example.com/serum-glow',
  },
  {
    category: 'proteção',
    name: 'Protetor Solar Fluido SPF50',
    description: 'Proteção UVA/UVB com acabamento invisível.',
    skinTypes: ['todas'],
    usageTime: 'manhã',
    externalLink: 'https://example.com/spf-fluido',
  },
  {
    category: 'maquilhagem',
    name: 'Base Sérum Luminoso',
    description: 'Cobertura modular para look natural.',
    skinTypes: ['seca', 'normal'],
    usageTime: 'quando quiser realçar',
    externalLink: 'https://example.com/base-serum',
  },
];

export const getProducts = async (_req, res, next) => {
  try {
    const total = await Product.countDocuments();
    if (total === 0) {
      await Product.insertMany(seedProducts);
    }
    const products = await Product.find().lean();
    const grouped = products.reduce((acc, product) => {
      if (!acc[product.category]) acc[product.category] = [];
      acc[product.category].push(product);
      return acc;
    }, {});
    return sendSuccess(res, { categories: grouped });
  } catch (error) {
    next(error);
  }
};
