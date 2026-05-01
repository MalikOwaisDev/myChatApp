import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const muteConversationApi = (id) => API.put(`/conversations/${id}/mute`);
export const unmuteConversationApi = (id) => API.put(`/conversations/${id}/unmute`);
export const deleteConversationApi = (id) => API.delete(`/conversations/${id}`);
export const clearMessagesApi = (conversationId) => API.delete(`/messages/${conversationId}/clear`);
export const blockUserApi = (userId) => API.post('/users/block', { userId });
export const unblockUserApi = (userId) => API.post('/users/unblock', { userId });
