import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Buildings API
export const buildingsAPI = {
  getAll: (params) => axios.get(`${API_BASE_URL}/buildings`, { params }),
  getById: (id) => axios.get(`${API_BASE_URL}/buildings/${id}`),
  create: (data) => axios.post(`${API_BASE_URL}/buildings`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/buildings/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/buildings/${id}`)
};

// Units API
export const unitsAPI = {
  getAll: (buildingId) => axios.get(`${API_BASE_URL}/units/building/${buildingId}`),
  getById: (id) => axios.get(`${API_BASE_URL}/units/${id}`),
  create: (data) => axios.post(`${API_BASE_URL}/units`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/units/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/units/${id}`)
};

// Owners API
export const ownersAPI = {
  getAll: () => axios.get(`${API_BASE_URL}/owners`),
  getById: (id) => axios.get(`${API_BASE_URL}/owners/${id}`),
  create: (data) => axios.post(`${API_BASE_URL}/owners`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/owners/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/owners/${id}`)
};

// Activities API
export const activitiesAPI = {
  getAll: (params) => axios.get(`${API_BASE_URL}/activities`, { params }),
  create: (data) => axios.post(`${API_BASE_URL}/activities`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/activities/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/activities/${id}`)
};

// Transactions API
export const transactionsAPI = {
  getAll: (params) => axios.get(`${API_BASE_URL}/transactions`, { params }),
  create: (data) => axios.post(`${API_BASE_URL}/transactions`, data),
  update: (id, data) => axios.put(`${API_BASE_URL}/transactions/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE_URL}/transactions/${id}`)
};
