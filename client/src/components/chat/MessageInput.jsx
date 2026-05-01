import { useState, useRef } from 'react';
import { useChat } from '../../context/ChatContext';

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

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length > 2000) return;
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
        onChange={(e) => setText(e.target.value)}
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
