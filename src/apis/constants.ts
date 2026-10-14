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

// RN은 응답을 무한정 기다리므로, 서버가 이 시간 안에 응답하지 않으면 실패로 처리한다
export const REQUEST_TIMEOUT_MS = 15 * 1000;
