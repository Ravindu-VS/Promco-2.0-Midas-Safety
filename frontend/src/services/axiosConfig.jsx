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

// Add a request interceptor for authentication
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token = localStorage.getItem(apiConfig.STORAGE_KEYS.TOKEN);
    
    // If token exists, add to headers
    if (token) {
      config.headers[apiConfig.AUTH_HEADER] = `${apiConfig.TOKEN_PREFIX} ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response && error.response.status === 401) {
      console.log('Authentication error, redirecting to login...');
      // Clear auth data
      localStorage.removeItem(apiConfig.STORAGE_KEYS.TOKEN);
      localStorage.removeItem(apiConfig.STORAGE_KEYS.USER);
      
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
