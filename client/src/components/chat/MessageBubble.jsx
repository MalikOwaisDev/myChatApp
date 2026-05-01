const SingleCheckIcon = () => (
  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
    <path d="M1 4.5L4 7.5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DoubleCheckIcon = () => (
  <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
    <path d="M1 4.5L4 7.5L11 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 4.5L8 7.5L15 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MessageStatus = ({ status }) => {
  const isSeen = status === 'seen';
  const isDelivered = status === 'delivered' || isSeen;

  return (
    <span className={`msg-bubble__status${isSeen ? ' msg-bubble__status--seen' : ''}`} aria-label={status || 'sent'}>
      {isDelivered ? <DoubleCheckIcon /> : <SingleCheckIcon />}
    </span>
  );
};

const MessageBubble = ({ message, isMine }) => {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`msg-bubble-wrap${isMine ? ' msg-bubble-wrap--mine' : ''}`}>
      <div className={`msg-bubble${isMine ? ' msg-bubble--mine' : ' msg-bubble--theirs'}`}>
        <p className="msg-bubble__text">{message.text}</p>
        <div className="msg-bubble__footer">
          <span className="msg-bubble__time">{time}</span>
          {isMine && <MessageStatus status={message.status} />}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
