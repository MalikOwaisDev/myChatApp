import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileForm from '../components/profile/ProfileForm';
import ChangePasswordForm from '../components/profile/ChangePasswordForm';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="profile-wrapper">
      <div className="profile-orb profile-orb--1" aria-hidden="true" />
      <div className="profile-orb profile-orb--2" aria-hidden="true" />

      <div className="profile-container">
        <nav className="profile-nav">
          <Link to="/" className="profile-nav__back">← Back to Chat</Link>
          <button className="profile-nav__logout" onClick={logout}>Sign Out</button>
        </nav>

        <ProfileHeader user={user} />

        <div className="profile-grid">
          <ProfileForm />
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
};

export default Profile;
