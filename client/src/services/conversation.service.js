import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createOrGetConversationApi = (participantId) =>
  API.post('/conversations', { participantId });

export const getConversationsApi = () => API.get('/conversations');

export const getConversationByIdApi = (id) => API.get(`/conversations/${id}`);
