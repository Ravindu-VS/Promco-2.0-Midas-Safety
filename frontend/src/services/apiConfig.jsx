// API configuration settings

// Base URL for API calls
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Default request timeout in milliseconds
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Authentication header key
const AUTH_HEADER = 'Authorization';

// Prefix for auth token in header
const TOKEN_PREFIX = 'Bearer';

// Local storage keys
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme'
};

// API endpoints
const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh-token'
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`
  },
  MACHINES: {
    BASE: '/machines',
    BY_ID: (id) => `/machines/${id}`,
    MAINTENANCE: (id) => `/machines/${id}/maintenance`,
    FAULTS: (id) => `/machines/${id}/faults`
  },
  PARAMETERS: {
    BASE: '/parameters',
    BY_ID: (id) => `/parameters/${id}`,
    QUALIFIED_VALUES: (id) => `/parameters/${id}/qualified-values`
  }
};

export default {
  API_BASE_URL,
  REQUEST_TIMEOUT,
  AUTH_HEADER,
  TOKEN_PREFIX,
  STORAGE_KEYS,
  ENDPOINTS
};
