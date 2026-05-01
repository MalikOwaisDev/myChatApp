import apiClient from './apiClient';

export const getProfileApi = () => apiClient.get('/user/profile');
export const updateProfileApi = (data) => apiClient.put('/user/profile', data);
export const changePasswordApi = (data) => apiClient.put('/user/change-password', data);
