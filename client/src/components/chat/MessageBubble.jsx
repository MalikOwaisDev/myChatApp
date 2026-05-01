const MessageBubble = ({ message, isMine }) => {
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`msg-bubble-wrap${isMine ? ' msg-bubble-wrap--mine' : ''}`}>
      <div className={`msg-bubble${isMine ? ' msg-bubble--mine' : ' msg-bubble--theirs'}`}>
        <p className="msg-bubble__text">{message.text}</p>
        <span className="msg-bubble__time">{time}</span>
      </div>
    </div>
  );
};

export default MessageBubble;
