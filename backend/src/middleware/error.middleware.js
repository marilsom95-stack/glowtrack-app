import { sendError } from '../utils/response.js';

export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Rota ${req.originalUrl} não existe.`);
  error.status = 404;
  next(error);
};

export const errorHandler = (err, req, res, _next) => {
  const status = err.status || 500;
  const message =
    err.message || 'Algo não correu como esperado. Tenta novamente mais tarde.';
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }
  return sendError(res, status, message);
};
