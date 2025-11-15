import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import pkg from './package.json' assert { type: 'json' };
import { loadEnv, getEnvConfig } from './src/config/env.js';
import statusRouter from './src/routes/status.routes.js';
import authRouter from './src/routes/auth.routes.js';
import oauthRouter from './src/routes/oauth.routes.js';
import skinRouter from './src/routes/skin.routes.js';
import makeupRouter from './src/routes/makeup.routes.js';
import productsRouter from './src/routes/products.routes.js';
import lifestyleRouter from './src/routes/lifestyle.routes.js';
import moodRouter from './src/routes/mood.routes.js';
import progressRouter from './src/routes/progress.routes.js';
import { connectDB } from './src/config/db.js';
import { sendSuccess } from './src/utils/response.js';
import { errorHandler } from './src/middlewares/errorHandler.js';

loadEnv();
const { port, nodeEnv } = getEnvConfig();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan(nodeEnv === 'production' ? 'combined' : 'dev'));

app.use('/api/status', statusRouter);
app.use('/api/auth', authRouter);
app.use('/api/auth', oauthRouter);
app.use('/api/skin', skinRouter);
app.use('/api/makeup', makeupRouter);
app.use('/api/products', productsRouter);
app.use('/api/lifestyle', lifestyleRouter);
app.use('/api/mood', moodRouter);
app.use('/api/progress', progressRouter);

app.get('/api/version', (req, res) => {
  return sendSuccess(res, { version: pkg.version }, 'GlowTrack API version');
});

app.use((req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.status = 404;
  next(error);
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`🚀 GlowTrack API running in ${nodeEnv} mode on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
