import apiClient from './apiClient';

export const sendMediaApi = (conversationId, media) =>
  apiClient.post('/messages/media', { conversationId, media });
