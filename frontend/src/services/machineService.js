import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

// Get all machines
export const getAllMachines = async () => {
  try {
    const response = await axios.get(`${API_URL}/machines`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching machines:', error);
    throw error;
  }
};

// Get machine by id
export const getMachineById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/machines/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching machine ${id}:`, error);
    throw error;
  }
};

// Create new machine
export const createMachine = async (machineData) => {
  try {
    const response = await axios.post(`${API_URL}/machines`, machineData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating machine:', error);
    throw error;
  }
};

// Update machine
export const updateMachine = async (id, machineData) => {
  try {
    const response = await axios.put(`${API_URL}/machines/${id}`, machineData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating machine ${id}:`, error);
    throw error;
  }
};

// Delete machine
export const deleteMachine = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/machines/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting machine ${id}:`, error);
    throw error;
  }
};

// Report machine fault
export const reportMachineFault = async (machineId, faultData) => {
  try {
    const response = await axios.post(`${API_URL}/machines/${machineId}/faults`, faultData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error reporting fault for machine ${machineId}:`, error);
    throw error;
  }
};

// Get machine maintenance history
export const getMachineMaintenanceHistory = async (machineId) => {
  try {
    const response = await axios.get(`${API_URL}/machines/${machineId}/maintenance`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching maintenance history for machine ${machineId}:`, error);
    throw error;
  }
};
