// During development the CRA dev server proxies /api to the backend (see "proxy" in package.json),
// so no CORS or certificate setup is needed. For a separately hosted build set
// REACT_APP_API_BASE_URL, e.g. https://api.example.com/api
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

const apiConfig = {
  API_BASE_URL,
  REQUEST_TIMEOUT: 30000,
  AUTH_HEADER: 'Authorization',
  TOKEN_PREFIX: 'Bearer',
  STORAGE_KEYS: {
    TOKEN: 'token',
    USER: 'user',
  },
};

export default apiConfig;
