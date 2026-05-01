import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import socket from '../socket/socket';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';

const NotificationContext = createContext(null);

const pushNotification = (setNotifications, setUnreadCount, entry) => {
  setNotifications((prev) => {
    if (prev.some((n) => n.id === entry.id)) return prev;
    return [entry, ...prev].slice(0, 50);
  });
  setUnreadCount((c) => c + 1);
};

export const NotificationProvider = ({ children }) => {
  const { token, user } = useAuth();
  const { showToast } = useUI();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const myIdRef = useRef(null);
  useEffect(() => { myIdRef.current = user?.id ? String(user.id) : null; }, [user]);

  useEffect(() => {
    if (!token) return;
    socket.auth = { token };
    socket.connect();
    return () => { socket.disconnect(); };
  }, [token]);

  useEffect(() => {
    const handleNotification = (data) => {
      pushNotification(setNotifications, setUnreadCount, data);
      showToast(data.message, data.type ?? 'info');
    };

    const handleReceiveMessage = (message) => {
      const senderId = String(message.senderId);
      if (myIdRef.current && senderId === myIdRef.current) return;

      const isMedia = message.messageType === 'media';
      const entry = {
        id: `msg_${message._id}`,
        type: 'message',
        message: `${message.senderName || 'Someone'} ${isMedia ? 'sent you a photo' : 'sent you a message'}`,
        conversationId: String(message.conversationId),
        timestamp: message.createdAt,
      };
      pushNotification(setNotifications, setUnreadCount, entry);
    };

    socket.on('notification', handleNotification);
    socket.on('receive_message', handleReceiveMessage);
    return () => {
      socket.off('notification', handleNotification);
      socket.off('receive_message', handleReceiveMessage);
    };
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
