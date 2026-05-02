import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getSettingsApi, updateSettingsApi } from '../services/settings.service';
import { blockUserApi, unblockUserApi } from '../services/conversationManagement.service';

const SettingsContext = createContext(null);

const DEFAULT_SETTINGS = { notificationsEnabled: true, soundEnabled: true };

export const SettingsProvider = ({ children }) => {
  const { token } = useAuth();
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [loadingSettings, setLoadingSettings] = useState(false);

  useEffect(() => {
    if (!token) {
      setSettings(DEFAULT_SETTINGS);
      setBlockedUsers([]);
      setIsPublic(true);
      return;
    }
    setLoadingSettings(true);
    getSettingsApi()
      .then(({ data }) => {
        if (data.settings) setSettings(data.settings);
        if (data.blockedUsers) setBlockedUsers(data.blockedUsers);
        if (typeof data.isPublic === 'boolean') setIsPublic(data.isPublic);
      })
      .catch(() => {})
      .finally(() => setLoadingSettings(false));
  }, [token]);

  const updateSettings = useCallback(async (updates) => {
    const { data } = await updateSettingsApi(updates);
    if (data.settings) setSettings(data.settings);
    if (typeof data.isPublic === 'boolean') setIsPublic(data.isPublic);
  }, []);

  const blockUser = useCallback(async (userId) => {
    const { data } = await blockUserApi(userId);
    setBlockedUsers((prev) => [
      ...prev.filter((u) => String(u._id) !== String(userId)),
      data.user,
    ]);
    return data.user;
  }, []);

  const unblockUser = useCallback(async (userId) => {
    await unblockUserApi(userId);
    setBlockedUsers((prev) => prev.filter((u) => String(u._id) !== String(userId)));
  }, []);

  const isBlocked = useCallback(
    (userId) => blockedUsers.some((u) => String(u._id) === String(userId)),
    [blockedUsers]
  );

  return (
    <SettingsContext.Provider
      value={{ settings, blockedUsers, isPublic, loadingSettings, updateSettings, blockUser, unblockUser, isBlocked }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
