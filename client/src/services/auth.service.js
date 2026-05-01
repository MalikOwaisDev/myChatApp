import apiClient from './apiClient';

export const registerApi = (data) => apiClient.post('/auth/register', data);
export const loginApi = (data) => apiClient.post('/auth/login', data);
export const forgotPasswordApi = (email) => apiClient.post('/auth/forgot-password', { email });
export const resetPasswordApi = (token, password) =>
  apiClient.post('/auth/reset-password', { token, password });
export const getMeApi = () => apiClient.get('/auth/me');
