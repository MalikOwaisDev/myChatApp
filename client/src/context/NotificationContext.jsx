import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import socket from '../socket/socket';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { token } = useAuth();
  const { showToast } = useUI();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token) return;
    socket.auth = { token };
    socket.connect();
    return () => { socket.disconnect(); };
  }, [token]);

  useEffect(() => {
    const handleNotification = (data) => {
      setNotifications((prev) => {
        if (prev.some((n) => n.id === data.id)) return prev;
        return [data, ...prev].slice(0, 50);
      });
      setUnreadCount((c) => c + 1);
      showToast(data.message, data.type ?? 'info');
    };

    socket.on('notification', handleNotification);
    return () => socket.off('notification', handleNotification);
  }, [showToast]);

  useEffect(() => {
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [token]);

  const markAllRead = useCallback(() => setUnreadCount(0), []);
  const clearAll = useCallback(() => { setNotifications([]); setUnreadCount(0); }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
