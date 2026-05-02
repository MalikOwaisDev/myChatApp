import SettingsPanel from '../components/settings/SettingsPanel';
import PrivacySection from '../components/settings/PrivacySection';
import AccountInfo from '../components/settings/AccountInfo';
import AppearanceSection from '../components/settings/AppearanceSection';

const Settings = () => (
  <div className="settings-page">
    <div className="settings-page__header">
      <h1 className="settings-page__title">Settings</h1>
      <p className="settings-page__sub">Manage your preferences and privacy</p>
    </div>
    <div className="settings-page__body">
      <AppearanceSection />
      <SettingsPanel />
      <PrivacySection />
      <AccountInfo />
    </div>
  </div>
);

export default Settings;
