import { useState } from 'react';

const ChatRequestBanner = ({ request, onRespond }) => {
  const [loading, setLoading] = useState(null); // 'accept' | 'reject'

  const handle = async (action) => {
    setLoading(action);
    try {
      await onRespond(String(request._id), action);
    } finally {
      setLoading(null);
    }
  };

  const name = request.from?.name || 'Someone';

  return (
    <div className="chat-request-banner" role="alert">
      <div className="chat-request-banner__icon">✉</div>
      <div className="chat-request-banner__body">
        <p className="chat-request-banner__title">Message request from {name}</p>
        <p className="chat-request-banner__sub">
          Accept to start chatting, or decline to ignore.
        </p>
      </div>
      <div className="chat-request-banner__actions">
        <button
          className="chat-request-banner__btn chat-request-banner__btn--accept"
          onClick={() => handle('accept')}
          disabled={loading !== null}
          type="button"
        >
          {loading === 'accept' ? 'Accepting…' : 'Accept'}
        </button>
        <button
          className="chat-request-banner__btn chat-request-banner__btn--reject"
          onClick={() => handle('reject')}
          disabled={loading !== null}
          type="button"
        >
          {loading === 'reject' ? 'Declining…' : 'Decline'}
        </button>
      </div>
    </div>
  );
};

export default ChatRequestBanner;
