import mongoose from 'mongoose';
import { getEnvConfig } from './env.js';

/**
 * Establishes a connection to MongoDB using mongoose.
 */
export const connectDB = async () => {
  const { mongoUri, nodeEnv } = getEnvConfig();

  if (!mongoUri) {
    throw new Error('Missing MONGO_URI environment variable.');
  }

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: nodeEnv !== 'production'
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};
