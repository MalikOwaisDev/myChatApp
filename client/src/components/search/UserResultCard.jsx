const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const UserResultCard = ({ user }) => {
  const initials = user.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : user.username[0].toUpperCase();

  return (
    <div className="user-result-card">
      <div className="user-result-card__avatar">
        {user.profileImage ? (
          <img className="user-result-card__img" src={user.profileImage} alt={user.name} />
        ) : (
          <div className="user-result-card__initials">{initials}</div>
        )}
      </div>
      <div className="user-result-card__info">
        <p className="user-result-card__name">{user.name}</p>
        <p className="user-result-card__username">@{user.username}</p>
      </div>
      <span className="user-result-card__chevron" aria-hidden="true">
        <ChevronIcon />
      </span>
    </div>
  );
};

export default UserResultCard;
