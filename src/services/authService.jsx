import axios from 'axios';

const API_URL = 'https://example.com/api';

export const loginUser = async (email, password) => {
  return await axios.post(`${API_URL}/login`, { email, password });
};

export const createUser = async (email, password) => {
  return await axios.post(`${API_URL}/admin/create-user`, { email, password });
};

