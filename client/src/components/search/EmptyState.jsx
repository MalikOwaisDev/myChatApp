const NoResultsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

const EmptyState = ({ title = 'No results found', sub }) => (
  <div className="empty-state">
    <div className="empty-state__icon">
      <NoResultsIcon />
    </div>
    <p className="empty-state__title">{title}</p>
    {sub && <p className="empty-state__sub">{sub}</p>}
  </div>
);

export default EmptyState;
