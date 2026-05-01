import apiClient from './apiClient';

export const createOrGetConversationApi = (participantId) =>
  apiClient.post('/conversations', { participantId });

export const getConversationsApi = () => apiClient.get('/conversations');

export const getConversationByIdApi = (id) => apiClient.get(`/conversations/${id}`);
