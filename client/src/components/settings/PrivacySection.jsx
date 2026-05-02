import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import ToggleSwitch from './ToggleSwitch';

const PrivacySection = () => {
  const { blockedUsers, unblockUser, isPublic, updateSettings } = useSettings();
  const [unblocking, setUnblocking] = useState(null);
  const [savingVisibility, setSavingVisibility] = useState(false);

  const handleUnblock = async (userId) => {
    setUnblocking(userId);
    try {
      await unblockUser(userId);
    } finally {
      setUnblocking(null);
    }
  };

  const handleVisibilityToggle = async (value) => {
    setSavingVisibility(true);
    try {
      await updateSettings({ isPublic: value });
    } finally {
      setSavingVisibility(false);
    }
  };

  return (
    <div className="settings-section">
      <h3 className="settings-section__title">Privacy</h3>
      <div className="settings-section__body">
        {/* Profile visibility toggle */}
        <div className="settings-row">
          <div className="settings-row__info">
            <span className="settings-row__label">Public Profile</span>
            <span className="settings-row__sub">
              {isPublic
                ? 'Anyone can find you in suggestions and search'
                : 'You only appear in search, not in suggestions'}
            </span>
          </div>
          <ToggleSwitch
            id="isPublic"
            checked={isPublic}
            onChange={handleVisibilityToggle}
            disabled={savingVisibility}
          />
        </div>

        {/* Blocked users */}
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
