import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { useSettings } from '../../context/SettingsContext';
import ConfirmModal from './ConfirmModal';

const DotsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <circle cx="12" cy="5" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="19" r="1.5" />
  </svg>
);

const CONFIRM_NONE = null;

const ChatMenu = ({ conversationId, participant, isMuted }) => {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(CONFIRM_NONE);
  const [actionLoading, setActionLoading] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const { muteConversation, unmuteConversation, deleteConversation, clearMessages } = useChat();
  const { blockUser, unblockUser, isBlocked } = useSettings();

  const participantId = participant?._id ? String(participant._id) : null;
  const blocked = participantId ? isBlocked(participantId) : false;

  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const run = async (action) => {
    setActionLoading(true);
    try {
      await action();
    } finally {
      setActionLoading(false);
      setConfirm(CONFIRM_NONE);
      setOpen(false);
    }
  };

  const actions = {
    mute: () => run(() => muteConversation(conversationId)),
    unmute: () => run(() => unmuteConversation(conversationId)),
    clear: () => run(() => clearMessages(conversationId)),
    delete: () => run(async () => {
      await deleteConversation(conversationId);
      navigate('/chat');
    }),
    block: () => run(() => blockUser(participantId)),
    unblock: () => run(() => unblockUser(participantId)),
  };

  const confirmConfigs = {
    clear: { title: 'Clear Chat', message: 'This will remove all messages for you. The other person can still see them.', confirmLabel: 'Clear', danger: true },
    delete: { title: 'Delete Conversation', message: 'This conversation will be removed from your inbox.', confirmLabel: 'Delete', danger: true },
    block: { title: `Block ${participant?.name || 'User'}`, message: 'They will no longer be able to send you messages.', confirmLabel: 'Block', danger: true },
  };

  return (
    <div className="chat-menu" ref={menuRef}>
      <button
        type="button"
        className="chat-menu__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat options"
        aria-expanded={open}
      >
        <DotsIcon />
      </button>

      {open && (
        <div className="chat-menu__dropdown" role="menu">
          <button
            className="chat-menu__item"
            onClick={() => { setOpen(false); isMuted ? actions.unmute() : setConfirm(null) || actions.mute(); }}
            type="button"
          >
            {isMuted ? 'Unmute Conversation' : 'Mute Conversation'}
          </button>
          <button
            className="chat-menu__item"
            onClick={() => { setOpen(false); setConfirm('clear'); }}
            type="button"
          >
            Clear Chat
          </button>
          <button
            className="chat-menu__item chat-menu__item--danger"
            onClick={() => { setOpen(false); setConfirm('delete'); }}
            type="button"
          >
            Delete Conversation
          </button>
          {participantId && (
            <button
              className="chat-menu__item chat-menu__item--danger"
              onClick={() => { setOpen(false); blocked ? actions.unblock() : setConfirm('block'); }}
              type="button"
            >
              {blocked ? 'Unblock User' : 'Block User'}
            </button>
          )}
        </div>
      )}

      {confirm && confirmConfigs[confirm] && (
        <ConfirmModal
          {...confirmConfigs[confirm]}
          loading={actionLoading}
          onConfirm={actions[confirm]}
          onCancel={() => setConfirm(CONFIRM_NONE)}
        />
      )}
    </div>
  );
};

export default ChatMenu;
