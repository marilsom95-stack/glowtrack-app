const TOKEN_KEY = 'glowtrack_token';

const isBrowser = () => typeof window !== 'undefined';

export const saveToken = (token) => {
  if (isBrowser()) {
    window.localStorage.setItem(TOKEN_KEY, token);
  }
};

export const getToken = () => {
  if (isBrowser()) {
    return window.localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

export const clearToken = () => {
  if (isBrowser()) {
    window.localStorage.removeItem(TOKEN_KEY);
  }
};
