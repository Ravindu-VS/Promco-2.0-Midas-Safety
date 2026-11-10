import apiConfig from './apiConfig';
import axiosInstance from './axiosConfig';

const { TOKEN, USER } = apiConfig.STORAGE_KEYS;

export const ROLES = ['admin', 'manager', 'technician', 'operator', 'user'];

// Turns an axios error into a message that can be shown to the user.
export const errorMessage = (error, fallback = 'Something went wrong') => {
  if (!error) return fallback;
  if (!error.response) return 'Cannot reach the server. Make sure the backend is running.';
  return error.response.data?.message || fallback;
};

const normalizeUser = (user) => (user ? { ...user, name: user.username } : null);

const saveUser = (user) => {
  const normalized = normalizeUser(user);
  localStorage.setItem(USER, JSON.stringify(normalized));
  window.dispatchEvent(new Event('promco:user-updated'));
  return normalized;
};

export const loginUser = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  const { user, token } = response.data || {};
  if (!user || !token) throw new Error('Unexpected login response from server');
  localStorage.setItem(TOKEN, token);
  return saveUser(user);
};

// Reloads the signed-in user from the server (keeps role/profile changes in sync).
export const refreshCurrentUser = async () => {
  const response = await axiosInstance.get('/auth/me');
  return saveUser(response.data);
};

export const setCurrentUser = (user) => saveUser(user);

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(USER);
    return userStr ? JSON.parse(userStr) : null;
  } catch (e) {
    return null;
  }
};

export const isAuthenticated = () => !!getCurrentUser() && !!localStorage.getItem(TOKEN);

export const hasRole = (...roles) => roles.includes(getCurrentUser()?.role);

export const logout = () => {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(USER);
};
