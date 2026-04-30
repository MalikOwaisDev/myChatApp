import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerApi = (data) => API.post('/auth/register', data);
export const loginApi = (data) => API.post('/auth/login', data);
export const forgotPasswordApi = (email) => API.post('/auth/forgot-password', { email });
export const resetPasswordApi = (token, password) =>
  API.post('/auth/reset-password', { token, password });
export const getMeApi = () => API.get('/auth/me');
