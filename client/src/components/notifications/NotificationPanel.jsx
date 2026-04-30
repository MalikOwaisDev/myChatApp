import { useNotifications } from '../../context/NotificationContext';
import NotificationItem from './NotificationItem';

const NotificationPanel = () => {
  const { notifications, clearAll } = useNotifications();

  return (
    <div className="notif-panel" role="menu">
      <div className="notif-panel__header">
        <p className="notif-panel__title">Notifications</p>
        {notifications.length > 0 && (
          <button className="notif-panel__clear" onClick={clearAll}>
            Clear all
          </button>
        )}
      </div>
      <div className="notif-panel__list">
        {notifications.length === 0 ? (
          <div className="notif-panel__empty">No notifications yet</div>
        ) : (
          notifications.map((n) => <NotificationItem key={n.id} notification={n} />)
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
