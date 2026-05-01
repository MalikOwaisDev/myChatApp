import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import ConversationList from './ConversationList';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatLayout = () => {
  const { conversationId } = useParams();
  const { conversations, setActiveConversationId, getOtherParticipant, loadMessages, messages } =
    useChat();

  const activeConv = conversations.find((c) => String(c._id) === conversationId);
  const otherParticipant = activeConv ? getOtherParticipant(activeConv) : null;

  useEffect(() => {
    if (conversationId && !messages[conversationId]) {
      loadMessages(conversationId, 1);
    }
  }, [conversationId, messages, loadMessages]);

  return (
    <div className="chat-layout">
      <ConversationList activeConversationId={conversationId} />

      <div className={`chat-window${conversationId ? ' chat-window--active' : ''}`}>
        {conversationId && activeConv ? (
          <>
            <ChatHeader participant={otherParticipant} />
            <MessageList conversationId={conversationId} />
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
