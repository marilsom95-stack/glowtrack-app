import mongoose from 'mongoose';

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/glowtrack';

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || DEFAULT_URI;
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB || undefined,
  });
  console.log('✅ Connected to MongoDB');
};
