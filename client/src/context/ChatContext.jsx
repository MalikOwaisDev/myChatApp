import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket/socket';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';
import { useSettings } from './SettingsContext';
import {
  getConversationsApi,
  createOrGetConversationApi,
} from '../services/conversation.service';
import { getMessagesApi, markSeenApi } from '../services/message.service';
import { sendMediaApi } from '../services/media.service';
import {
  muteConversationApi,
  unmuteConversationApi,
  deleteConversationApi,
  clearMessagesApi,
} from '../services/conversationManagement.service';
import { getIncomingRequestsApi, respondToRequestApi } from '../services/chatRequest.service';
import { useMarkConversationRead } from './NotificationContext';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { token, user } = useAuth();
  const { showToast } = useUI();
  const { settings } = useSettings();
  const markConversationRead = useMarkConversationRead();
  const navigate = useNavigate();
  const myId = user?.id ? String(user.id) : null;

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});
  const [onlineUsers, setOnlineUsers] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const [uploading, setUploading] = useState(false);
  const [chatRequests, setChatRequests] = useState([]);

  const activeConvIdRef = useRef(activeConversationId);
  useEffect(() => { activeConvIdRef.current = activeConversationId; }, [activeConversationId]);

  const myIdRef = useRef(myId);
  useEffect(() => { myIdRef.current = myId; }, [myId]);

  const settingsRef = useRef(settings);
  useEffect(() => { settingsRef.current = settings; }, [settings]);

  const conversationsRef = useRef(conversations);
  useEffect(() => { conversationsRef.current = conversations; }, [conversations]);

  const messagesRef = useRef(messages);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  // ─── Load conversations (initialises unread counts from API) ─────────────────
  const loadConversations = useCallback(async () => {
    if (!token) return;
    setLoadingConversations(true);
    try {
      const { data } = await getConversationsApi();
      setConversations(data);
      // Seed unread counts from server-computed values
      const counts = {};
      for (const c of data) {
        if (c.unreadCount > 0) counts[String(c._id)] = c.unreadCount;
      }
      setUnreadCounts((prev) => ({ ...prev, ...counts }));
    } catch {
      // silently fail
    } finally {
      setLoadingConversations(false);
    }
  }, [token]);

  // ─── Load chat requests ───────────────────────────────────────────────────────
  const loadChatRequests = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await getIncomingRequestsApi();
      setChatRequests(data);
    } catch {}
  }, [token]);

  // cursor = null → initial load; cursor = message _id → load older
  const loadMessages = useCallback(async (conversationId, cursor = null) => {
    if (cursor) {
      setLoadingMore(true);
    } else {
      setLoadingMessages(true);
    }
    try {
      const { data } = await getMessagesApi(conversationId, cursor);
      setMessages((prev) => {
        const existing = prev[conversationId] || [];
        if (!cursor) return { ...prev, [conversationId]: data.messages };
        const existingIds = new Set(existing.map((m) => String(m._id)));
        const newMsgs = data.messages.filter((m) => !existingIds.has(String(m._id)));
        return { ...prev, [conversationId]: [...newMsgs, ...existing] };
      });
      setHasMoreMessages((prev) => ({ ...prev, [conversationId]: data.hasMore }));
    } catch {
      // silently fail
    } finally {
      if (cursor) {
        setLoadingMore(false);
      } else {
        setLoadingMessages(false);
      }
    }
  }, []);

  // ─── activateConversation ─────────────────────────────────────────────────────
  // Called by ChatLayout whenever the URL conversationId changes (including
  // navigation from a notification). Does NOT navigate — navigation is the
  // caller's responsibility.
  const activateConversation = useCallback(
    async (conversationId) => {
      setActiveConversationId(conversationId);
      setUnreadCounts((prev) => ({ ...prev, [conversationId]: 0 }));
      markConversationRead(conversationId);

      // Load messages only if not already cached
      if (!messagesRef.current[conversationId]) {
        await loadMessages(conversationId);
      }

      // If conversation is not in the sidebar list, reload the list
      if (!conversationsRef.current.some((c) => String(c._id) === conversationId)) {
        loadConversations();
      }

      markSeenApi(conversationId).catch(() => {});
    },
    [loadMessages, loadConversations, markConversationRead]
  );

  // ─── deactivateConversation ───────────────────────────────────────────────────
  // Called by ChatLayout on unmount so messages arriving after the user leaves
  // the chat aren't instantly marked seen due to stale activeConvIdRef.
  const deactivateConversation = useCallback(() => {
    setActiveConversationId(null);
  }, []);

  // ─── openConversation (navigate + activate) ───────────────────────────────────
  const openConversation = useCallback(
    async (conversationId) => {
      navigate(`/chat/${conversationId}`);
      // activateConversation is triggered by ChatLayout's useEffect on route change
    },
    [navigate]
  );

  const startConversation = useCallback(
    async (participantId) => {
      const { data } = await createOrGetConversationApi(participantId);
      setConversations((prev) => {
        const exists = prev.some((c) => c._id === data._id);
        return exists ? prev : [data, ...prev];
      });
      navigate(`/chat/${data._id}`);
    },
    [navigate]
  );

  const loadEarlierMessages = useCallback(
    async (conversationId) => {
      const msgs = messagesRef.current[conversationId] || [];
      if (msgs.length === 0) return;
      const cursor = String(msgs[0]._id);
      await loadMessages(conversationId, cursor);
    },
    [loadMessages]
  );

  // ─── Conversation management actions ──────────────────────────────────────────
  const muteConversation = useCallback(
    async (conversationId) => {
      await muteConversationApi(conversationId);
      setConversations((prev) =>
        prev.map((c) =>
          String(c._id) === conversationId
            ? { ...c, mutedBy: [...(c.mutedBy || []), myId] }
            : c
        )
      );
    },
    [myId]
  );

  const unmuteConversation = useCallback(
    async (conversationId) => {
      await unmuteConversationApi(conversationId);
      setConversations((prev) =>
        prev.map((c) =>
          String(c._id) === conversationId
            ? { ...c, mutedBy: (c.mutedBy || []).filter((id) => String(id) !== myId) }
            : c
        )
      );
    },
    [myId]
  );

  const deleteConversation = useCallback(async (conversationId) => {
    await deleteConversationApi(conversationId);
    setConversations((prev) => prev.filter((c) => String(c._id) !== conversationId));
    setMessages((prev) => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
    setHasMoreMessages((prev) => {
      const next = { ...prev };
      delete next[conversationId];
      return next;
    });
    setActiveConversationId(null);
  }, []);

  const clearMessages = useCallback(async (conversationId) => {
    await clearMessagesApi(conversationId);
    setMessages((prev) => ({ ...prev, [conversationId]: [] }));
    setHasMoreMessages((prev) => ({ ...prev, [conversationId]: false }));
  }, []);

  // ─── Chat request actions ─────────────────────────────────────────────────────
  const respondToRequest = useCallback(
    async (requestId, action) => {
      const { data } = await respondToRequestApi(requestId, action);
      setChatRequests((prev) => prev.filter((r) => String(r._id) !== requestId));
      if (action === 'accept') {
        loadConversations();
      }
      return data;
    },
    [loadConversations]
  );

  const getRequestForConversation = useCallback(
    (conversationId) =>
      chatRequests.find((r) => String(r.conversationId?._id ?? r.conversationId) === String(conversationId)),
    [chatRequests]
  );

  const pendingRequestCount = chatRequests.length;

  // ─── Bootstrap on login ───────────────────────────────────────────────────────
  useEffect(() => {
    if (token) {
      loadConversations();
      loadChatRequests();
    } else {
      setConversations([]);
      setMessages({});
      setActiveConversationId(null);
      setHasMoreMessages({});
      setUnreadCounts({});
      setOnlineUsers({});
      setTypingUsers({});
      setChatRequests([]);
    }
  }, [token, loadConversations, loadChatRequests]);

  // ─── Real-time: incoming messages ─────────────────────────────────────────────
  useEffect(() => {
    const handleReceiveMessage = (message) => {
      const convId = String(message.conversationId);
      const senderId = String(message.senderId);

      setMessages((prev) => {
        const existing = prev[convId] || [];
        if (existing.some((m) => String(m._id) === String(message._id))) return prev;
        return { ...prev, [convId]: [...existing, message] };
      });

      setConversations((prev) => {
        const exists = prev.some((c) => String(c._id) === convId);
        if (!exists) {
          // New conversation arrived — reload the list
          loadConversations();
          return prev;
        }
        return prev
          .map((c) =>
            String(c._id) === convId
              ? { ...c, lastMessage: message, updatedAt: message.createdAt }
              : c
          )
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });

      setTypingUsers((prev) => {
        if (!prev[convId]) return prev;
        const next = { ...prev };
        delete next[convId];
        return next;
      });

      const currentMyId = myIdRef.current;
      if (currentMyId && senderId !== currentMyId) {
        socket.emit('mark_delivered', { conversationId: convId });

        if (convId === activeConvIdRef.current) {
          // User is viewing this chat — mark seen immediately
          markSeenApi(convId).catch(() => {});
        } else {
          setUnreadCounts((prev) => ({ ...prev, [convId]: (prev[convId] || 0) + 1 }));

          const conv = conversationsRef.current.find((c) => String(c._id) === convId);
          const isMuted = conv?.mutedBy?.some((id) => String(id) === currentMyId);
          if (!isMuted && settingsRef.current?.notificationsEnabled !== false) {
            const sender = conv?.participants?.find((p) => String(p._id) !== currentMyId);
            showToast(`New message from ${sender?.name || message.senderName || 'Someone'}`, 'info');
          }
        }
      }
    };

    socket.on('receive_message', handleReceiveMessage);
    return () => socket.off('receive_message', handleReceiveMessage);
  }, [myId, showToast, loadConversations]);

  // ─── Real-time: new incoming chat request ─────────────────────────────────────
  useEffect(() => {
    const handleNewChatRequest = (request) => {
      setChatRequests((prev) => {
        if (prev.some((r) => String(r._id) === String(request._id))) return prev;
        return [request, ...prev];
      });
      // Also reload conversations so the new conversation appears in the sidebar
      loadConversations();
    };

    socket.on('new_chat_request', handleNewChatRequest);
    return () => socket.off('new_chat_request', handleNewChatRequest);
  }, [loadConversations]);

  // ─── Real-time: chat request updates ──────────────────────────────────────────
  useEffect(() => {
    const handleRequestUpdate = ({ conversationId, status }) => {
      if (status === 'accepted') {
        showToast('Your message request was accepted!', 'success');
        // Unblock local state so user can send more messages
      } else if (status === 'rejected') {
        showToast('Your message request was declined.', 'info');
      }
    };

    socket.on('chat_request_update', handleRequestUpdate);
    return () => socket.off('chat_request_update', handleRequestUpdate);
  }, [showToast]);

  // ─── Real-time: message status updates ────────────────────────────────────────
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

  // ─── Real-time: presence ──────────────────────────────────────────────────────
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

  // ─── Real-time: typing indicators ─────────────────────────────────────────────
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

  const sendMedia = useCallback(
    async (conversationId, media) => {
      setUploading(true);
      try {
        await sendMediaApi(conversationId, media);
      } catch {
        showToast('Failed to send image', 'error');
      } finally {
        setUploading(false);
      }
    },
    [showToast]
  );

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
        loadingMore,
        hasMoreMessages,
        loadConversations,
        loadMessages,
        activateConversation,
        deactivateConversation,
        openConversation,
        startConversation,
        sendMessage,
        sendMedia,
        uploading,
        loadEarlierMessages,
        getOtherParticipant,
        unreadCounts,
        onlineUsers,
        typingUsers,
        muteConversation,
        unmuteConversation,
        deleteConversation,
        clearMessages,
        chatRequests,
        respondToRequest,
        getRequestForConversation,
        pendingRequestCount,
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
