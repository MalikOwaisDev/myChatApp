import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import UserCard from '../components/dashboard/UserCard';
import QuickActions from '../components/dashboard/QuickActions';
import StatsCard from '../components/dashboard/StatsCard';
import SectionWrapper from '../components/layout/SectionWrapper';
import { getDashboardApi } from '../services/dashboard.service';

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const MessageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const formatMemberSince = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardApi()
      .then(({ data }) => {
        if (data.stats) setStats(data.stats);
      })
      .catch(() => {});
  }, []);

  const memberSince = formatMemberSince(stats?.memberSince ?? user?.createdAt);
  const profileComplete = stats?.profileComplete ?? !!(user?.name && user?.username && user?.profileImage);

  return (
    <div className="dashboard-page">
      <div className="dashboard-orb dashboard-orb--1" aria-hidden="true" />
      <div className="dashboard-orb dashboard-orb--2" aria-hidden="true" />
      <div className="dashboard-container">
        <DashboardHeader user={user} />

        <SectionWrapper>
          <div className="dashboard-grid">
            <UserCard user={user} />
            <QuickActions />
          </div>
        </SectionWrapper>

        <SectionWrapper title="Overview">
          <div className="stats-row">
            <StatsCard
              icon={<CalendarIcon />}
              label="Member Since"
              value={memberSince}
            />
            <StatsCard
              icon={<ShieldIcon />}
              label="Profile"
              value={profileComplete ? 'Complete' : 'Incomplete'}
              note={!profileComplete ? 'Add a profile picture' : null}
            />
            <StatsCard
              icon={<MessageIcon />}
              label="Messages Sent"
              value={stats ? String(stats.messages) : '—'}
            />
          </div>
        </SectionWrapper>
      </div>
    </div>
  );
};

export default Dashboard;
