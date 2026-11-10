import { usersApi } from './api';
import { errorMessage } from './authService';

// Wraps the users API in { success, data | error } results for the User Management page.
const wrap = async (fn, fallback) => {
  try {
    return { success: true, data: await fn() };
  } catch (e) {
    return { success: false, error: errorMessage(e, fallback) };
  }
};

const userService = {
  getAllUsers: () => wrap(() => usersApi.list(), 'Failed to fetch users'),
  getUserById: (id) => wrap(() => usersApi.get(id), 'Failed to fetch user'),
  createUser: (payload) => wrap(() => usersApi.create(payload), 'Failed to create user'),
  updateUser: (id, payload) => wrap(() => usersApi.update(id, payload), 'Failed to update user'),
  deleteUser: (id) => wrap(() => usersApi.remove(id), 'Failed to delete user'),
};

export default userService;
