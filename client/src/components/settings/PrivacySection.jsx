import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

const PrivacySection = () => {
  const { blockedUsers, unblockUser } = useSettings();
  const [unblocking, setUnblocking] = useState(null);

  const handleUnblock = async (userId) => {
    setUnblocking(userId);
    try {
      await unblockUser(userId);
    } finally {
      setUnblocking(null);
    }
  };

  return (
    <div className="settings-section">
      <h3 className="settings-section__title">Privacy</h3>
      <div className="settings-section__body">
        <p className="settings-section__label">Blocked Users</p>
        {blockedUsers.length === 0 ? (
          <p className="settings-section__empty">No blocked users.</p>
        ) : (
          <ul className="blocked-list">
            {blockedUsers.map((u) => (
              <li key={u._id} className="blocked-list__item">
                <div className="blocked-list__user">
                  {u.profileImage ? (
                    <img src={u.profileImage} alt={u.name} className="blocked-list__avatar" />
                  ) : (
                    <span className="blocked-list__initials">
                      {u.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?'}
                    </span>
                  )}
                  <div className="blocked-list__info">
                    <span className="blocked-list__name">{u.name}</span>
                    <span className="blocked-list__username">@{u.username}</span>
                  </div>
                </div>
                <button
                  className="blocked-list__unblock"
                  onClick={() => handleUnblock(String(u._id))}
                  disabled={unblocking === String(u._id)}
                  type="button"
                >
                  {unblocking === String(u._id) ? 'Unblocking…' : 'Unblock'}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PrivacySection;
