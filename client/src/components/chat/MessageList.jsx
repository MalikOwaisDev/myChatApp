import { useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import usePagination from '../../hooks/usePagination';
import MessageBubble from './MessageBubble';
import MediaMessageBubble from './MediaMessageBubble';
import InfiniteScrollLoader from './InfiniteScrollLoader';
import MessagePaginationLoader from './MessagePaginationLoader';

const MessageList = ({ conversationId }) => {
  const { user } = useAuth();
  const { messages, loadingMessages } = useChat();
  const { hasMore, loadMore, loadingMore } = usePagination(conversationId);

  const msgs = messages[conversationId] || [];
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const prevLengthRef = useRef(0);
  const savedScrollOffsetRef = useRef(0); // scrollHeight - scrollTop before load

  // Called by InfiniteScrollLoader when sentinel enters viewport
  const handleLoadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const container = containerRef.current;
    if (container) {
      savedScrollOffsetRef.current = container.scrollHeight - container.scrollTop;
    }
    loadMore();
  }, [loadMore, loadingMore, hasMore]);

  // After DOM updates: restore scroll (older msgs) or scroll to bottom (new msg)
  useLayoutEffect(() => {
    const prevLen = prevLengthRef.current;
    const newLen = msgs.length;
    prevLengthRef.current = newLen;

    if (newLen <= prevLen) return;

    const container = containerRef.current;
    if (!container) return;

    if (savedScrollOffsetRef.current > 0) {
      // Prepended older messages — restore relative scroll position
      container.scrollTop = container.scrollHeight - savedScrollOffsetRef.current;
      savedScrollOffsetRef.current = 0;
    } else {
      // Appended new message — scroll to bottom
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [msgs.length]);

  if (loadingMessages && msgs.length === 0) {
    return (
      <div className="msg-list msg-list--loading">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`msg-list__skeleton${i % 2 === 0 ? ' msg-list__skeleton--mine' : ''}`} />
        ))}
      </div>
    );
  }

  return (
    <div className="msg-list" ref={containerRef}>
      {/* Sentinel — triggers load when scrolled into view */}
      <InfiniteScrollLoader onIntersect={handleLoadMore} disabled={!hasMore || loadingMore} />

      {loadingMore && <MessagePaginationLoader />}

      {msgs.length === 0 ? (
        <div className="msg-list__empty">
          <p>No messages yet. Say hello!</p>
        </div>
      ) : (
        msgs.map((msg) => {
          const isMine = !!(user?.id && String(msg.senderId) === String(user.id));
          return msg.messageType === 'media' ? (
            <MediaMessageBubble key={msg._id} message={msg} isMine={isMine} />
          ) : (
            <MessageBubble key={msg._id} message={msg} isMine={isMine} />
          );
        })
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
