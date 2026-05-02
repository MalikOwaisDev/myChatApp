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

      // Don't add a bell entry if the user is already viewing this conversation
      const convId = String(message.conversationId);
      if (window.location.pathname === `/chat/${convId}`) return;

      const isMedia = message.messageType === 'media';
      const entry = {
        id: `msg_${message._id}`,
        type: 'message',
        message: `${message.senderName || 'Someone'} ${isMedia ? 'sent you a photo' : 'sent you a message'}`,
        conversationId: convId,
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

  const markConversationRead = useCallback((conversationId) => {
    const convId = String(conversationId);
    setNotifications((prev) => {
      const filtered = prev.filter((n) => String(n.conversationId) !== convId);
      const delta = prev.length - filtered.length;
      if (delta > 0) setUnreadCount((c) => Math.max(0, c - delta));
      return filtered;
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, clearAll, markConversationRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

export const useMarkConversationRead = () => useNotifications().markConversationRead;
