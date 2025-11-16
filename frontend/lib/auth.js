export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('glowtrack_token');
};

export const setToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('glowtrack_token', token);
};

export const clearToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('glowtrack_token');
};

export const isAuthenticated = () => Boolean(getToken());
