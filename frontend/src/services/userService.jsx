import apiConfig from './apiConfig';
import axiosInstance from './axiosConfig';

const API_URL = `${apiConfig.API_BASE_URL}/users`;

// Get all users (admin only)
const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(API_URL);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch users'
    };
  }
};

// Get user by ID
const getUserById = async (userId) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch user'
    };
  }
};

// Create user (admin only)
const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post(API_URL, userData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create user'
    };
  }
};

// Update user
const updateUser = async (userId, userData) => {
  try {
    const response = await axiosInstance.put(`${API_URL}/${userId}`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update user'
    };
  }
};

// Delete user (admin only)
const deleteUser = async (userId) => {
  try {
    const response = await axiosInstance.delete(`${API_URL}/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete user'
    };
  }
};

const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};

export default userService;
