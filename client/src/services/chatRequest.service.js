import apiClient from './apiClient';

export const getIncomingRequestsApi = () => apiClient.get('/chat-requests');

export const respondToRequestApi = (requestId, action) =>
  apiClient.post('/chat-requests/respond', { requestId, action });
