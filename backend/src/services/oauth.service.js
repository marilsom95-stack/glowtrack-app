import { User } from '../models/user.model.js';

export const findOrCreateOAuthUser = async (provider, providerId, profileData = {}) => {
  let user = await User.findOne({ provider, providerId });

  if (!user && profileData.email) {
    user = await User.findOne({ email: profileData.email });
  }

  if (!user) {
    user = await User.create({
      name: profileData.name || 'GlowTrack User',
      email: profileData.email,
      provider,
      providerId
    });
  }

  return user;
};
