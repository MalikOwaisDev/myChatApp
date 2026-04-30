const StatsCard = ({ icon, label, value, note }) => (
  <div className="stat-card">
    <div className="stat-card__icon">{icon}</div>
    <div className="stat-card__value">{value}</div>
    <div className="stat-card__label">{label}</div>
    {note && <div className="stat-card__note">{note}</div>}
  </div>
);

export default StatsCard;
