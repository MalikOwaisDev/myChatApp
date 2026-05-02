import { useChat } from '../../context/ChatContext';
import ConversationItem from './ConversationItem';

const ConversationList = ({ activeConversationId }) => {
  const { conversations, loadingConversations, openConversation, unreadCounts, pendingRequestCount } = useChat();

  return (
    <aside className="conv-list">
      <div className="conv-list__header">
        <h2 className="conv-list__title">Messages</h2>
        {pendingRequestCount > 0 && (
          <span className="conv-list__req-badge" title={`${pendingRequestCount} pending request${pendingRequestCount > 1 ? 's' : ''}`}>
            {pendingRequestCount}
          </span>
        )}
      </div>

      <div className="conv-list__body">
        {loadingConversations && conversations.length === 0 ? (
          <div className="conv-list__loading">
            {[1, 2, 3].map((i) => (
              <div key={i} className="conv-list__skeleton" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="conv-list__empty">
            <p>No conversations yet.</p>
            <p>Find people to start chatting.</p>
          </div>
        ) : (
          conversations.map((conv) => (
            <ConversationItem
              key={conv._id}
              conversation={conv}
              isActive={String(conv._id) === String(activeConversationId)}
              unreadCount={unreadCounts[conv._id] || 0}
              onClick={() => openConversation(conv._id)}
            />
          ))
        )}
      </div>
    </aside>
  );
};

export default ConversationList;
