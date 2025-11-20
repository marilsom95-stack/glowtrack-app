import Product from '../models/Product.js';
import { sendSuccess } from '../utils/response.js';

const seedProducts = [
  {
    category: 'limpeza',
    name: 'Gel Purificante Calmante',
    description: 'Remove impurezas sem agredir a barreira cutânea.',
    skinTypes: ['oleosa', 'mista'],
    ingredients: ['niacinamida', 'pantenol'],
    usageTime: 'manhã e noite',
    photoURL: 'https://placehold.co/400x240',
  },
  {
    category: 'hidratação',
    name: 'Creme Nuvem com Ácido Hialurónico',
    description: 'Textura leve que hidrata durante 24h.',
    skinTypes: ['normal', 'seca'],
    ingredients: ['ácido hialurónico', 'ceramidas'],
    usageTime: 'manhã',
    photoURL: 'https://placehold.co/400x240',
  },
  {
    category: 'tratamento',
    name: 'Sérum Glow com Vitamina C',
    description: 'Uniformiza o tom e potencia o brilho.',
    skinTypes: ['todas'],
    ingredients: ['vitamina C', 'ferúlico'],
    usageTime: 'manhã',
    photoURL: 'https://placehold.co/400x240',
  },
  {
    category: 'proteção',
    name: 'Protetor Solar Fluido SPF50',
    description: 'Proteção UVA/UVB com acabamento invisível.',
    skinTypes: ['todas'],
    ingredients: ['filtros UV estáveis'],
    usageTime: 'manhã',
    photoURL: 'https://placehold.co/400x240',
  },
  {
    category: 'maquilhagem',
    name: 'Base Sérum Luminoso',
    description: 'Cobertura modular para look natural.',
    skinTypes: ['seca', 'normal'],
    ingredients: ['óleos secos', 'pérolas luminosas'],
    usageTime: 'quando quiser realçar',
    photoURL: 'https://placehold.co/400x240',
  },
];

export const getProducts = async (req, res, next) => {
  try {
    const total = await Product.countDocuments();
    if (total === 0) {
      await Product.insertMany(seedProducts);
    }
    const query = {};
    if (req.query.categoria) query.category = req.query.categoria;
    if (req.query.tipoPele) query.skinTypes = req.query.tipoPele;
    const products = await Product.find(query).lean();
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
