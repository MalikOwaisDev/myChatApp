import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getMessagesApi = (conversationId, page = 1, limit = 30) =>
  API.get(`/messages/${conversationId}`, { params: { page, limit } });

export const sendMessageApi = (conversationId, text) =>
  API.post(`/messages/${conversationId}`, { text });

export const markDeliveredApi = (conversationId) =>
  API.put('/messages/delivered', { conversationId });

export const markSeenApi = (conversationId) =>
  API.put('/messages/seen', { conversationId });
