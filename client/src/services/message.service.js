import apiClient from './apiClient';

export const getMessagesApi = (conversationId, cursor = null, limit = 30) =>
  apiClient.get(`/messages/${conversationId}`, {
    params: { ...(cursor ? { cursor } : {}), limit },
  });

export const sendMessageApi = (conversationId, text) =>
  apiClient.post(`/messages/${conversationId}`, { text });

export const markDeliveredApi = (conversationId) =>
  apiClient.put('/messages/delivered', { conversationId });

export const markSeenApi = (conversationId) =>
  apiClient.put('/messages/seen', { conversationId });
