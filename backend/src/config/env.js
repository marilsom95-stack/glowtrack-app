import dotenv from 'dotenv';

/**
 * Loads environment variables from the .env file into process.env.
 * Should be executed before any configuration that depends on env vars.
 */
export const loadEnv = () => {
  const result = dotenv.config();

  if (result.error && process.env.NODE_ENV !== 'production') {
    console.warn('⚠️  No .env file detected. Falling back to existing environment variables.');
  }
};

/**
 * Returns the normalized application configuration derived from environment variables.
 */
export const getEnvConfig = () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
  appleClientId: process.env.APPLE_CLIENT_ID || '',
  appleTeamId: process.env.APPLE_TEAM_ID || '',
  appleKeyId: process.env.APPLE_KEY_ID || '',
  applePrivateKey: process.env.APPLE_PRIVATE_KEY || '',
  appleCallbackUrl: process.env.APPLE_CALLBACK_URL || ''
});
