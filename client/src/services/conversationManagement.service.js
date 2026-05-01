import apiClient from './apiClient';

export const muteConversationApi = (id) => apiClient.put(`/conversations/${id}/mute`);
export const unmuteConversationApi = (id) => apiClient.put(`/conversations/${id}/unmute`);
export const deleteConversationApi = (id) => apiClient.delete(`/conversations/${id}`);
export const clearMessagesApi = (conversationId) =>
  apiClient.delete(`/messages/${conversationId}/clear`);
export const blockUserApi = (userId) => apiClient.post('/users/block', { userId });
export const unblockUserApi = (userId) => apiClient.post('/users/unblock', { userId });
