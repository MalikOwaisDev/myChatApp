import { useNavigate } from 'react-router-dom';

const typeIcons = { success: '✓', error: '✕', info: 'i', warning: '!', message: '✉' };

const formatTime = (ts) => {
  if (!ts) return '';
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
};

const NotificationItem = ({ notification, onClose }) => {
  const { type = 'info', message, timestamp, conversationId } = notification;
  const navigate = useNavigate();

  const isClickable = Boolean(conversationId);

  const handleClick = () => {
    if (!isClickable) return;
    navigate(`/chat/${conversationId}`);
    onClose?.();
  };

  const Tag = isClickable ? 'button' : 'div';

  return (
    <Tag
      className={`notif-item notif-item--${type}${isClickable ? ' notif-item--clickable' : ''}`}
      onClick={isClickable ? handleClick : undefined}
      type={isClickable ? 'button' : undefined}
    >
      <span className="notif-item__icon">{typeIcons[type] ?? typeIcons.info}</span>
      <div className="notif-item__body">
        <p className="notif-item__message">{message}</p>
        <time className="notif-item__time">{formatTime(timestamp)}</time>
      </div>
      {isClickable && <span className="notif-item__arrow">›</span>}
    </Tag>
  );
};

export default NotificationItem;
