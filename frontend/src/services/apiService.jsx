import axiosInstance from './axiosConfig';
import apiConfig from './apiConfig';

// Point to the configured backend server
const API_URL = apiConfig.API_BASE_URL;

// Generic request function with authentication
const request = async (method, endpoint, data = null, withAuth = true) => {
  try {
    const config = {};
    
    if (data && (method === 'post' || method === 'put' || method === 'patch')) {
      config.data = data;
    } else if (data) {
      config.params = data;
    }
    
    const response = await axiosInstance({
      method,
      url: endpoint,
      ...config
    });
    
    return response.data;
  } catch (error) {
    console.error(`API Error (${method.toUpperCase()} ${endpoint}):`, error);
    throw error;
  }
};

// API methods for machines
export const machineService = {
  getAllMachines: () => request('get', '/machines'),
  getMachineById: (id) => request('get', `/machines/${id}`),
  createMachine: (data) => request('post', '/machines', data),
  updateMachine: (id, data) => request('put', `/machines/${id}`, data),
  deleteMachine: (id) => request('delete', `/machines/${id}`),
  getMachineMaintenance: (id) => request('get', `/machines/${id}/maintenance`),
  getMachineFaults: (id) => request('get', `/machines/${id}/faults`),
  reportMachineFault: (id, data) => request('post', `/machines/${id}/faults`, data)
};

// API methods for users
export const userService = {
  getAllUsers: () => request('get', '/users'),
  getUserById: (id) => request('get', `/users/${id}`),
  updateUser: (id, data) => request('put', `/users/${id}`, data),
  deleteUser: (id) => request('delete', `/users/${id}`)
};

// API methods for parameters
export const parameterService = {
  getAllParameters: () => request('get', '/parameters'),
  getParameterById: (id) => request('get', `/parameters/${id}`),
  createParameter: (data) => request('post', '/parameters', data),
  updateParameter: (id, data) => request('put', `/parameters/${id}`, data),
  deleteParameter: (id) => request('delete', `/parameters/${id}`),
  getParameterQualifiedValues: (id) => request('get', `/parameters/${id}/qualified-values`)
};

// Export the base request function for other custom API calls
export const api = {
  get: (endpoint, data, withAuth = true) => request('get', endpoint, data, withAuth),
  post: (endpoint, data, withAuth = true) => request('post', endpoint, data, withAuth),
  put: (endpoint, data, withAuth = true) => request('put', endpoint, data, withAuth),
  delete: (endpoint, withAuth = true) => request('delete', endpoint, null, withAuth)
};
