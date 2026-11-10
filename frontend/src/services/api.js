import axiosInstance from './axiosConfig';

const data = (promise) => promise.then((r) => r.data);

export const usersApi = {
  list: () => data(axiosInstance.get('/users')).then((d) => d.users),
  lookup: () => data(axiosInstance.get('/users/lookup')),
  get: (id) => data(axiosInstance.get(`/users/${id}`)),
  create: (payload) => data(axiosInstance.post('/users', payload)).then((d) => d.user),
  update: (id, payload) => data(axiosInstance.put(`/users/${id}`, payload)).then((d) => d.user),
  remove: (id) => data(axiosInstance.delete(`/users/${id}`)),
};

export const masterDataApi = {
  tables: () => data(axiosInstance.get('/masterdata')),
  list: (table) => data(axiosInstance.get(`/masterdata/${table}`)),
  create: (table, payload) => data(axiosInstance.post(`/masterdata/${table}`, payload)),
  update: (table, id, payload) => data(axiosInstance.put(`/masterdata/${table}/${id}`, payload)),
  remove: (table, id) => data(axiosInstance.delete(`/masterdata/${table}/${id}`)),
};

export const machinesApi = {
  list: () => data(axiosInstance.get('/machines')),
  get: (id) => data(axiosInstance.get(`/machines/${id}`)),
  create: (payload) => data(axiosInstance.post('/machines', payload)),
  update: (id, payload) => data(axiosInstance.put(`/machines/${id}`, payload)),
  remove: (id) => data(axiosInstance.delete(`/machines/${id}`)),
};

export const faultsApi = {
  list: (params = {}) => data(axiosInstance.get('/faults', { params })),
  report: (machineId, payload) => data(axiosInstance.post(`/machines/${machineId}/faults`, payload)),
  setStatus: (id, payload) => data(axiosInstance.put(`/faults/${id}/status`, payload)),
  remove: (id) => data(axiosInstance.delete(`/faults/${id}`)),
};

export const maintenanceApi = {
  list: (params = {}) => data(axiosInstance.get('/maintenance', { params })),
  schedule: (machineId, payload) => data(axiosInstance.post(`/machines/${machineId}/maintenance`, payload)),
  update: (id, payload) => data(axiosInstance.put(`/maintenance/${id}`, payload)),
  remove: (id) => data(axiosInstance.delete(`/maintenance/${id}`)),
};

export const notificationsApi = {
  list: (limit = 30) => data(axiosInstance.get('/notifications', { params: { limit } })),
  markRead: (id) => data(axiosInstance.post(`/notifications/${id}/read`)),
  markAllRead: () => data(axiosInstance.post('/notifications/read-all')),
};

export const messagesApi = {
  list: () => data(axiosInstance.get('/messages')),
  send: (payload) => data(axiosInstance.post('/messages', payload)),
  resolve: (id, reply) => data(axiosInstance.put(`/messages/${id}/resolve`, { reply })),
};

const tzOffset = () => new Date().getTimezoneOffset();

export const activityApi = {
  list: (params = {}) => data(axiosInstance.get('/activity', { params: { tzOffset: tzOffset(), ...params } })),
};

export const reportsApi = {
  daily: (date) => data(axiosInstance.get('/reports/daily', { params: { date, tzOffset: tzOffset() } })),
};

// Local calendar date as YYYY-MM-DD (toISOString would shift it to UTC)
export const toLocalDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : '—');
