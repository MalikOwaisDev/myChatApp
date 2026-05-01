import apiClient from './apiClient';

export const searchUsersApi = (query) =>
  apiClient.get(`/users/search?query=${encodeURIComponent(query)}`);
