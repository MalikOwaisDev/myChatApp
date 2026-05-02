import { Link } from 'react-router-dom';
import UserDropdown from './UserDropdown';
import NotificationBell from '../notifications/NotificationBell';
import { useTheme } from '../../context/ThemeContext';

const PaletteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5"  cy="7.5"  r=".5" fill="currentColor" />
    <circle cx="6.5"  cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.437-.652-.437-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const Navbar = () => {
  const { cycleTheme, theme, themes } = useTheme();
  const currentTheme = themes.find((t) => t.id === theme);

  return (
    <header className="navbar">
      <Link to="/" className="navbar__brand">
        <span className="navbar__brand-icon">◈</span>
        <span className="navbar__brand-name">Real Chat</span>
      </Link>
      <div className="navbar__actions">
        <button
          className="theme-toggle"
          onClick={cycleTheme}
          aria-label={`Theme: ${currentTheme?.label ?? theme}. Click to cycle.`}
          title={`Theme: ${currentTheme?.label ?? theme} (click to cycle)`}
        >
          <PaletteIcon />
        </button>
        <NotificationBell />
        <UserDropdown />
      </div>
    </header>
  );
};

export default Navbar;
