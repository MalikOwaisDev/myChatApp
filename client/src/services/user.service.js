import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getProfileApi = () => API.get('/user/profile');
export const updateProfileApi = (data) => API.put('/user/profile', data);
export const changePasswordApi = (data) => API.put('/user/change-password', data);
