import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket/socket';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';
import {
  getConversationsApi,
  createOrGetConversationApi,
} from '../services/conversation.service';
import { getMessagesApi, markDeliveredApi, markSeenApi } from '../services/message.service';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { token, user } = useAuth();
  const { showToast } = useUI();
  const navigate = useNavigate();
  const myId = user?.id ? String(user.id) : null;

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagePages, setMessagePages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingUsers, setTypingUsers] = useState({});

  const activeConvIdRef = useRef(activeConversationId);
  useEffect(() => { activeConvIdRef.current = activeConversationId; }, [activeConversationId]);

  const myIdRef = useRef(myId);
  useEffect(() => { myIdRef.current = myId; }, [myId]);

  const loadConversations = useCallback(async () => {
    if (!token) return;
    setLoadingConversations(true);
    try {
      const { data } = await getConversationsApi();
      setConversations(data);
    } catch {
      // silently fail — UI shows empty state
    } finally {
      setLoadingConversations(false);
    }
  }, [token]);

  const loadMessages = useCallback(async (conversationId, page = 1) => {
    setLoadingMessages(true);
    try {
      const { data } = await getMessagesApi(conversationId, page);
      setMessages((prev) => {
        const existing = prev[conversationId] || [];
        if (page === 1) return { ...prev, [conversationId]: data };
        const existingIds = new Set(existing.map((m) => String(m._id)));
        const newMsgs = data.filter((m) => !existingIds.has(String(m._id)));
        return { ...prev, [conversationId]: [...newMsgs, ...existing] };
      });
      setMessagePages((prev) => ({ ...prev, [conversationId]: page }));
    } catch {
      // silently fail
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  const openConversation = useCallback(async (conversationId) => {
    setActiveConversationId(conversationId);
    setUnreadCounts((prev) => ({ ...prev, [conversationId]: 0 }));
    if (!messages[conversationId]) {
      await loadMessages(conversationId, 1);
    }
    // Mark all messages as seen when opening the conversation
    markSeenApi(conversationId).catch(() => {});
    navigate(`/chat/${conversationId}`);
  }, [messages, loadMessages, navigate]);

  const startConversation = useCallback(async (participantId) => {
    const { data } = await createOrGetConversationApi(participantId);
    setConversations((prev) => {
      const exists = prev.some((c) => c._id === data._id);
      return exists ? prev : [data, ...prev];
    });
    await openConversation(data._id);
  }, [openConversation]);

  const loadEarlierMessages = useCallback(async (conversationId) => {
    const currentPage = messagePages[conversationId] || 1;
    await loadMessages(conversationId, currentPage + 1);
  }, [messagePages, loadMessages]);

  useEffect(() => {
    if (token) loadConversations();
    else {
      setConversations([]);
      setMessages({});
      setActiveConversationId(null);
      setOnlineUsers({});
      setTypingUsers({});
    }
  }, [token, loadConversations]);

  const conversationsRef = useRef(conversations);
  useEffect(() => { conversationsRef.current = conversations; }, [conversations]);

  // ─── Real-time: incoming messages ──────────────────────────────────────────
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      const convId = String(message.conversationId);
      const senderId = String(message.senderId);

      setMessages((prev) => {
        const existing = prev[convId] || [];
        if (existing.some((m) => String(m._id) === String(message._id))) return prev;
        return { ...prev, [convId]: [...existing, message] };
      });

      setConversations((prev) =>
        prev.map((c) =>
          String(c._id) === convId
            ? { ...c, lastMessage: message, updatedAt: message.createdAt }
            : c
        ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      );

      // Clear typing indicator when a message arrives
      setTypingUsers((prev) => {
        if (!prev[convId]) return prev;
        const next = { ...prev };
        delete next[convId];
        return next;
      });

      const currentMyId = myIdRef.current;
      if (currentMyId && senderId !== currentMyId) {
        // Mark as delivered via socket (faster than REST for real-time messages)
        socket.emit('mark_delivered', { conversationId: convId });

        // If this conversation is currently open, mark as seen immediately
        if (convId === activeConvIdRef.current) {
          markSeenApi(convId).catch(() => {});
        } else {
          setUnreadCounts((prev) => ({ ...prev, [convId]: (prev[convId] || 0) + 1 }));
          const conv = conversationsRef.current.find((c) => String(c._id) === convId);
          const sender = conv?.participants?.find((p) => String(p._id) !== currentMyId);
          showToast(`New message from ${sender?.name || 'Someone'}`, 'info');
        }
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => socket.off('receive_message', handleReceiveMessage);
  }, [myId, showToast]);

  // ─── Real-time: message status updates ─────────────────────────────────────
  useEffect(() => {
    const updateMessageStatuses = (conversationId, messageIds, status) => {
      const idSet = new Set(messageIds.map(String));
      setMessages((prev) => {
        const msgs = prev[conversationId];
        if (!msgs) return prev;
        const updated = msgs.map((m) =>
          idSet.has(String(m._id)) ? { ...m, status } : m
        );
        return { ...prev, [conversationId]: updated };
      });
    };

    const handleDelivered = ({ conversationId, messageIds }) => {
      updateMessageStatuses(String(conversationId), messageIds, 'delivered');
    };

    const handleSeen = ({ conversationId, messageIds }) => {
      updateMessageStatuses(String(conversationId), messageIds, 'seen');
    };

    socket.on('message_delivered', handleDelivered);
    socket.on('message_seen', handleSeen);

    return () => {
      socket.off('message_delivered', handleDelivered);
      socket.off('message_seen', handleSeen);
    };
  }, []);

  // ─── Real-time: presence ────────────────────────────────────────────────────
  useEffect(() => {
    const handlePresenceInit = ({ onlineUserIds }) => {
      const map = {};
      for (const id of onlineUserIds) map[String(id)] = true;
      setOnlineUsers(map);
    };

    const handleUserOnline = ({ userId }) => {
      setOnlineUsers((prev) => ({ ...prev, [String(userId)]: true }));
    };

    const handleUserOffline = ({ userId }) => {
      setOnlineUsers((prev) => {
        const next = { ...prev };
        delete next[String(userId)];
        return next;
      });
    };

    socket.on('presence_init', handlePresenceInit);
    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);

    return () => {
      socket.off('presence_init', handlePresenceInit);
      socket.off('user_online', handleUserOnline);
      socket.off('user_offline', handleUserOffline);
    };
  }, []);

  // ─── Real-time: typing indicators ──────────────────────────────────────────
  useEffect(() => {
    const handleTypingStart = ({ conversationId }) => {
      setTypingUsers((prev) => ({ ...prev, [String(conversationId)]: true }));
    };

    const handleTypingStop = ({ conversationId }) => {
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[String(conversationId)];
        return next;
      });
    };

    socket.on('typing_start', handleTypingStart);
    socket.on('typing_stop', handleTypingStop);

    return () => {
      socket.off('typing_start', handleTypingStart);
      socket.off('typing_stop', handleTypingStop);
    };
  }, []);

  const sendMessage = useCallback((conversationId, text) => {
    socket.emit('send_message', { conversationId, text });
  }, []);

  const getOtherParticipant = useCallback(
    (conversation) => {
      if (!myId || !conversation?.participants) return null;
      return conversation.participants.find((p) => String(p._id) !== myId);
    },
    [myId]
  );

  return (
    <ChatContext.Provider
      value={{
        conversations,
        messages,
        activeConversationId,
        loadingConversations,
        loadingMessages,
        loadConversations,
        loadMessages,
        openConversation,
        startConversation,
        sendMessage,
        loadEarlierMessages,
        getOtherParticipant,
        messagePages,
        unreadCounts,
        onlineUsers,
        typingUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};
