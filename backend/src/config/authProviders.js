import { getEnvConfig } from './env.js';

const {
  googleClientId,
  googleClientSecret,
  googleCallbackUrl,
  appleClientId,
  appleTeamId,
  appleKeyId,
  applePrivateKey,
  appleCallbackUrl
} = getEnvConfig();

export const googleAuthConfig = {
  clientID: googleClientId,
  clientSecret: googleClientSecret,
  callbackURL: googleCallbackUrl
};

export const appleAuthConfig = {
  clientID: appleClientId,
  teamID: appleTeamId,
  keyID: appleKeyId,
  privateKey: applePrivateKey?.replace(/\\n/g, '\n'),
  callbackURL: appleCallbackUrl
};
