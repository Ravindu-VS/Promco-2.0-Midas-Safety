import apiConfig from './apiConfig';
import axiosInstance from './axiosConfig';

// Point to the configured backend server
const API_URL = apiConfig.API_BASE_URL;

export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/auth/login`, { email, password });
    // Store the token and user info in localStorage
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    console.error('Create user error:', error);
    throw error;
  }
};

// Get the current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  return JSON.parse(userStr);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Logout user by removing token and user info
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Add auth headers for authenticated requests
export const authHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

