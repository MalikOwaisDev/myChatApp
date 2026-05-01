import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import socket from '../../socket/socket';

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const MessageInput = ({ conversationId }) => {
  const [text, setText] = useState('');
  const { sendMessage } = useChat();
  const textareaRef = useRef(null);
  const isTypingRef = useRef(false);
  const typingTimerRef = useRef(null);

  const stopTyping = () => {
    clearTimeout(typingTimerRef.current);
    if (isTypingRef.current) {
      isTypingRef.current = false;
      socket.emit('typing_stop', { conversationId });
    }
  };

  // Stop typing on conversation change or unmount
  useEffect(() => {
    return () => {
      clearTimeout(typingTimerRef.current);
      if (isTypingRef.current) {
        isTypingRef.current = false;
        socket.emit('typing_stop', { conversationId });
      }
    };
  }, [conversationId]);

  const handleChange = (e) => {
    const val = e.target.value;
    setText(val);

    if (val.trim()) {
      if (!isTypingRef.current) {
        isTypingRef.current = true;
        socket.emit('typing_start', { conversationId });
      }
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        isTypingRef.current = false;
        socket.emit('typing_stop', { conversationId });
      }, 2000);
    } else {
      stopTyping();
    }
  };

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 2000) return;
    stopTyping();
    sendMessage(conversationId, trimmed);
    setText('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="msg-input">
      <textarea
        ref={textareaRef}
        className="msg-input__field"
        placeholder="Type a message… (Enter to send)"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
        maxLength={2000}
      />
      <button
        className={`msg-input__send${text.trim() ? ' msg-input__send--active' : ''}`}
        onClick={handleSend}
        disabled={!text.trim()}
        aria-label="Send message"
        type="button"
      >
        <SendIcon />
      </button>
    </div>
  );
};

export default MessageInput;
