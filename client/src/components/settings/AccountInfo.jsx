import { useAuth } from '../../context/AuthContext';

const AccountInfo = () => {
  const { user } = useAuth();

  return (
    <div className="settings-section">
      <h3 className="settings-section__title">Account Info</h3>
      <div className="settings-section__body">
        <div className="account-info">
          {user?.profileImage && (
            <img src={user.profileImage} alt={user.name} className="account-info__avatar" />
          )}
          <div className="account-info__rows">
            <div className="account-info__row">
              <span className="account-info__label">Name</span>
              <span className="account-info__value">{user?.name || '—'}</span>
            </div>
            <div className="account-info__row">
              <span className="account-info__label">Username</span>
              <span className="account-info__value">@{user?.username || '—'}</span>
            </div>
            <div className="account-info__row">
              <span className="account-info__label">Email</span>
              <span className="account-info__value">{user?.email || '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
