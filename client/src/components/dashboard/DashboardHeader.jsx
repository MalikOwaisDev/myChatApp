const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const DashboardHeader = ({ user }) => (
  <header className="dashboard-header">
    <p className="dashboard-header__greeting">{getGreeting()}</p>
    <h1 className="dashboard-header__name">{user?.name ?? 'there'}</h1>
    <p className="dashboard-header__sub">
      Here&apos;s your personal overview. Real-time messaging is on its way.
    </p>
  </header>
);

export default DashboardHeader;
