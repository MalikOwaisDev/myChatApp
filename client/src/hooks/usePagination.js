import { useCallback } from 'react';
import { useChat } from '../context/ChatContext';

const usePagination = (conversationId) => {
  const { messages, hasMoreMessages, loadingMore, loadEarlierMessages } = useChat();

  const msgs = messages[conversationId] || [];
  const hasMore = hasMoreMessages[conversationId] ?? false;

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore && msgs.length > 0) {
      loadEarlierMessages(conversationId);
    }
  }, [conversationId, loadingMore, hasMore, msgs.length, loadEarlierMessages]);

  return { hasMore, loadMore, loadingMore };
};

export default usePagination;
