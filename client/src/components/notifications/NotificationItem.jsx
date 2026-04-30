const typeIcons = { success: '✓', error: '✕', info: 'i', warning: '!' };

const formatTime = (ts) => {
  if (!ts) return '';
  const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
};

const NotificationItem = ({ notification }) => {
  const { type = 'info', message, timestamp } = notification;

  return (
    <div className={`notif-item notif-item--${type}`}>
      <span className="notif-item__icon">{typeIcons[type] ?? typeIcons.info}</span>
      <div className="notif-item__body">
        <p className="notif-item__message">{message}</p>
        <time className="notif-item__time">{formatTime(timestamp)}</time>
      </div>
    </div>
  );
};

export default NotificationItem;
