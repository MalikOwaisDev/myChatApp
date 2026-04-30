import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="dashboard">
      <div className="dashboard__orb dashboard__orb--1" aria-hidden="true" />
      <div className="dashboard__orb dashboard__orb--2" aria-hidden="true" />
      <div className="dashboard__content">
        <div className="dashboard__icon">◈</div>
        <h1 className="dashboard__title">
          Welcome back, <span>{firstName}</span>
        </h1>
        <p className="dashboard__subtitle">
          Real-time chat is on its way. Stay tuned.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
