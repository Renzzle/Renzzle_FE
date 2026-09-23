export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

export const HTTP_HEADERS = {
  CONTENT_TYPE: 'content-type',
  AUTHORIZATION: 'authorization',
  STATE: 'state',
  NONCE: 'nonce',
  APP_KEY: 'x-app-key',
};

export const HTTP_HEADERS_VALUES = {
  JSON: 'application/json',
};

// Sent with every request so the server can verify the client
export const APP_KEY_HEADER = process.env.APP_KEY
  ? { [HTTP_HEADERS.APP_KEY]: process.env.APP_KEY }
  : {};
