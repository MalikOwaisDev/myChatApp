import { Link } from 'react-router-dom';
import UserDropdown from './UserDropdown';

const Navbar = () => (
  <header className="navbar">
    <Link to="/" className="navbar__brand">
      <span className="navbar__brand-icon">◈</span>
      <span className="navbar__brand-name">Real Chat</span>
    </Link>
    <div className="navbar__actions">
      <UserDropdown />
    </div>
  </header>
);

export default Navbar;
