import apiClient from './apiClient';

export const getDashboardApi = () => apiClient.get('/dashboard');
