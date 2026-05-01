import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import ConversationList from './ConversationList';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

const ChatLayout = () => {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const {
    conversations,
    getOtherParticipant,
    loadMessages,
    messages,
    onlineUsers,
    typingUsers,
  } = useChat();

  const myId = user?.id ? String(user.id) : null;
  const activeConv = conversations.find((c) => String(c._id) === conversationId);
  const otherParticipant = activeConv ? getOtherParticipant(activeConv) : null;
  const isOnline = otherParticipant ? !!onlineUsers[String(otherParticipant._id)] : false;
  const isTyping = conversationId ? !!typingUsers[conversationId] : false;
  const isMuted = myId && activeConv?.mutedBy?.some((id) => String(id) === myId);

  useEffect(() => {
    if (conversationId && !messages[conversationId]) {
      loadMessages(conversationId);
    }
  }, [conversationId, messages, loadMessages]);

  return (
    <div className="chat-layout">
      <ConversationList activeConversationId={conversationId} />

      <div className={`chat-window${conversationId ? ' chat-window--active' : ''}`}>
        {conversationId && activeConv ? (
          <>
            <ChatHeader
              participant={otherParticipant}
              isOnline={isOnline}
              conversationId={conversationId}
              isMuted={!!isMuted}
            />
            <MessageList conversationId={conversationId} />
            {isTyping && <TypingIndicator name={otherParticipant?.name} />}
            <MessageInput conversationId={conversationId} />
          </>
        ) : (
          <div className="chat-window__empty">
            <div className="chat-window__empty-icon">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <p className="chat-window__empty-title">Select a conversation</p>
            <p className="chat-window__empty-sub">
              Choose from the list or find someone new to chat with
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
