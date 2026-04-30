import { Link } from 'react-router-dom';

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const PeopleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const actions = [
  {
    label: 'My Profile',
    desc: 'Edit your info and avatar',
    to: '/profile',
    Icon: UserIcon,
    active: true,
  },
  {
    label: 'Start a Chat',
    desc: 'Message someone directly',
    Icon: ChatIcon,
    active: false,
  },
  {
    label: 'Find People',
    desc: 'Discover other users',
    Icon: PeopleIcon,
    active: false,
  },
  {
    label: 'Settings',
    desc: 'Manage your preferences',
    Icon: SettingsIcon,
    active: false,
  },
];

const QuickActions = () => (
  <div className="quick-actions">
    <p className="quick-actions__title">Quick Actions</p>
    <div className="quick-actions__grid">
      {actions.map(({ label, desc, to, Icon, active }) =>
        active ? (
          <Link key={label} to={to} className="action-item">
            <span className="action-item__icon"><Icon /></span>
            <span className="action-item__body">
              <span className="action-item__label">{label}</span>
              <span className="action-item__desc">{desc}</span>
            </span>
          </Link>
        ) : (
          <div key={label} className="action-item action-item--disabled">
            <span className="action-item__icon"><Icon /></span>
            <span className="action-item__body">
              <span className="action-item__label">{label}</span>
              <span className="action-item__desc">{desc}</span>
              <span className="action-item__soon">Coming soon</span>
            </span>
          </div>
        )
      )}
    </div>
  </div>
);

export default QuickActions;
