import { useNavigate } from 'react-router-dom';

const BackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const ChatHeader = ({ participant }) => {
  const navigate = useNavigate();

  const initials = participant?.name
    ? participant.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <header className="chat-header">
      <button className="chat-header__back" onClick={() => navigate('/chat')} aria-label="Back">
        <BackIcon />
      </button>

      <div className="chat-header__avatar">
        {participant?.profileImage ? (
          <img src={participant.profileImage} alt={participant.name} className="chat-header__img" />
        ) : (
          <span className="chat-header__initials">{initials}</span>
        )}
      </div>

      <div className="chat-header__info">
        <span className="chat-header__name">{participant?.name || 'Unknown'}</span>
        <span className="chat-header__username">@{participant?.username || '—'}</span>
      </div>
    </header>
  );
};

export default ChatHeader;
