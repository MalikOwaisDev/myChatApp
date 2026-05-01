import { useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import MessageBubble from './MessageBubble';
import MediaMessageBubble from './MediaMessageBubble';

const MessageList = ({ conversationId }) => {
  const { user } = useAuth();
  const { messages, loadingMessages, loadEarlierMessages, messagePages } = useChat();

  const msgs = messages[conversationId] || [];
  const bottomRef = useRef(null);
  const prevLengthRef = useRef(0);

  useEffect(() => {
    if (msgs.length > prevLengthRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevLengthRef.current = msgs.length;
  }, [msgs.length]);

  const currentPage = messagePages[conversationId] || 1;
  const hasMore = msgs.length === currentPage * 30;

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
    <div className="msg-list">
      {hasMore && (
        <button
          className="msg-list__load-more"
          onClick={() => loadEarlierMessages(conversationId)}
          disabled={loadingMessages}
        >
          {loadingMessages ? 'Loading…' : 'Load earlier messages'}
        </button>
      )}

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
