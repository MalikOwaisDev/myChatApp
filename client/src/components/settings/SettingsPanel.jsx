import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import ToggleSwitch from './ToggleSwitch';

const SettingsPanel = () => {
  const { settings, updateSettings } = useSettings();
  const [saving, setSaving] = useState(null);

  const handleToggle = async (key, value) => {
    setSaving(key);
    try {
      await updateSettings({ [key]: value });
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="settings-section">
      <h3 className="settings-section__title">Notifications</h3>
      <div className="settings-section__body">
        <div className="settings-row">
          <div className="settings-row__info">
            <span className="settings-row__label">Chat Notifications</span>
            <span className="settings-row__sub">Show toast alerts for new messages</span>
          </div>
          <ToggleSwitch
            id="notificationsEnabled"
            checked={!!settings.notificationsEnabled}
            onChange={(v) => handleToggle('notificationsEnabled', v)}
            disabled={saving === 'notificationsEnabled'}
          />
        </div>
        <div className="settings-row">
          <div className="settings-row__info">
            <span className="settings-row__label">Sound</span>
            <span className="settings-row__sub">Play sound on new messages</span>
          </div>
          <ToggleSwitch
            id="soundEnabled"
            checked={!!settings.soundEnabled}
            onChange={(v) => handleToggle('soundEnabled', v)}
            disabled={saving === 'soundEnabled'}
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
