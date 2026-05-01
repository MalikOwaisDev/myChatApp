import { useAuth } from '../../context/AuthContext';

const Avatar = ({ user, size = 40 }) => {
  if (user?.profileImage) {
    return (
      <div className="conv-avatar" style={{ width: size, height: size }}>
        <img src={user.profileImage} alt={user.name} className="conv-avatar__img" />
      </div>
    );
  }
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  return (
    <div className="conv-avatar" style={{ width: size, height: size }}>
      <span className="conv-avatar__initials">{initials}</span>
    </div>
  );
};

const ConversationItem = ({ conversation, isActive, unreadCount, onClick }) => {
  const { user } = useAuth();

  const myId = user?.id ? String(user.id) : null;
  const other = conversation.participants?.find(
    (p) => String(p._id) !== myId
  );

  const lastMsg = conversation.lastMessage;
  const preview = lastMsg?.text
    ? lastMsg.text.length > 40
      ? lastMsg.text.slice(0, 40) + '…'
      : lastMsg.text
    : 'No messages yet';

  const time = lastMsg?.createdAt
    ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <button
      className={`conv-item${isActive ? ' conv-item--active' : ''}`}
      onClick={onClick}
      type="button"
    >
      <Avatar user={other} />
      <div className="conv-item__body">
        <div className="conv-item__top">
          <span className="conv-item__name">{other?.name || 'Unknown'}</span>
          <div className="conv-item__meta">
            {time && <span className="conv-item__time">{time}</span>}
            {unreadCount > 0 && (
              <span className="conv-item__badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
          </div>
        </div>
        <span className={`conv-item__preview${unreadCount > 0 ? ' conv-item__preview--unread' : ''}`}>
          {preview}
        </span>
      </div>
    </button>
  );
};

export default ConversationItem;
