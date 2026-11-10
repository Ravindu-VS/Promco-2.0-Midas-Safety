import axios from 'axios';
import apiConfig from './apiConfig';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: apiConfig.API_BASE_URL,
  timeout: apiConfig.REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach the JWT (if any) to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(apiConfig.STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers[apiConfig.AUTH_HEADER] = `${apiConfig.TOKEN_PREFIX} ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle expired / invalid sessions
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isLoginCall = url.includes('/auth/login');

    // A 401 from the login endpoint just means "wrong credentials" – let the form show it.
    if (status === 401 && !isLoginCall) {
      localStorage.removeItem(apiConfig.STORAGE_KEYS.TOKEN);
      localStorage.removeItem(apiConfig.STORAGE_KEYS.USER);

      const onPublicPage = ['/', '/login'].includes(window.location.pathname);
      if (!onPublicPage) {
        window.location.assign('/login');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
