export const sendSuccess = (res, data = {}, message = 'OK') =>
  res.status(200).json({ success: true, message, data });

export const sendError = (res, status = 500, message = 'Erro interno.') =>
  res.status(status).json({ success: false, message });
