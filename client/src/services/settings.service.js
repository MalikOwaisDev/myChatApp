import apiClient from './apiClient';

export const getSettingsApi = () => apiClient.get('/settings');
export const updateSettingsApi = (data) => apiClient.put('/settings', data);
