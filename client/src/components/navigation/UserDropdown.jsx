import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserDropdown = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="user-dropdown" ref={ref}>
      <button
        className="user-dropdown__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {user?.profileImage ? (
          <img src={user.profileImage} alt={user.name} className="user-dropdown__avatar-img" />
        ) : (
          <div className="user-dropdown__avatar-initials">{initials}</div>
        )}
      </button>

      {open && (
        <div className="user-dropdown__menu" role="menu">
          <div className="user-dropdown__info">
            <p className="user-dropdown__name">{user?.name}</p>
            <p className="user-dropdown__email">{user?.email}</p>
          </div>
          <Link
            to="/profile"
            className="user-dropdown__item"
            role="menuitem"
            onClick={() => setOpen(false)}
          >
            My Profile
          </Link>
          <button
            className="user-dropdown__item user-dropdown__item--danger"
            role="menuitem"
            onClick={logout}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
