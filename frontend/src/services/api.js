import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 자동 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 인증 API
export const authAPI = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  getCurrentUser: () => axiosInstance.get('/auth/me'),
};

// 고객 API
export const customerAPI = {
  getCustomers: (params) => axiosInstance.get('/customers', { params }),
  getCustomerById: (id) => axiosInstance.get(`/customers/${id}`),
  createCustomer: (data) => axiosInstance.post('/customers', data),
  updateCustomer: (id, data) => axiosInstance.put(`/customers/${id}`, data),
  deleteCustomer: (id) => axiosInstance.delete(`/customers/${id}`),
  batchDelete: (customerIds) => axiosInstance.post('/customers/batch-delete', { customerIds }),
};

// Contact 일정 API
export const contactScheduleAPI = {
  createSchedule: (data) => axiosInstance.post('/contact-schedules', data),
  getScheduleByDate: (date) => axiosInstance.get(`/contact-schedules/date/${date}`),
  updateSchedule: (id, data) => axiosInstance.put(`/contact-schedules/${id}`, data),
  postpone: (customerId, days) => axiosInstance.post(`/contact-schedules/${customerId}/postpone`, { days }),
};

// Contact 이력 API
export const contactHistoryAPI = {
  getHistoriesByCustomer: (customerId) => axiosInstance.get(`/contact-histories/customer/${customerId}`),
  createHistory: (data) => axiosInstance.post('/contact-histories', data),
  updateHistory: (id, data) => axiosInstance.put(`/contact-histories/${id}`, data),
  deleteHistory: (id) => axiosInstance.delete(`/contact-histories/${id}`),
};

// 통계 API
export const statisticAPI = {
  getDashboardStats: () => axiosInstance.get('/statistics/dashboard'),
  getCustomerStats: () => axiosInstance.get('/statistics/customers'),
  getWeeklyStats: (date) => axiosInstance.get('/statistics/weekly', { params: { date } }),
  getMonthlyStats: (year, month) => axiosInstance.get('/statistics/monthly', { params: { year, month } }),
  getYearlyStats: (year) => axiosInstance.get('/statistics/yearly', { params: { year } }),
};

// Todo API
export const todoAPI = {
  getTodos: (date) => axiosInstance.get('/todos', { params: { date } }),
  createTodo: (data) => axiosInstance.post('/todos', data),
  updateTodo: (id, data) => axiosInstance.put(`/todos/${id}`, data),
  toggleComplete: (id) => axiosInstance.patch(`/todos/${id}/complete`),
  deleteTodo: (id) => axiosInstance.delete(`/todos/${id}`),
  reorderTodos: (todoIds) => axiosInstance.post('/todos/reorder', { todoIds }),
};

export default axiosInstance;
