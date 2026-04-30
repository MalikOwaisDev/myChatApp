const UserCard = ({ user }) => {
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="user-card">
      <div className="user-card__avatar">
        {user?.profileImage ? (
          <img className="user-card__img" src={user.profileImage} alt={user.name} />
        ) : (
          <div className="user-card__initials">{initials}</div>
        )}
      </div>
      <p className="user-card__name">{user?.name}</p>
      <p className="user-card__username">@{user?.username}</p>
      <p className="user-card__email">{user?.email}</p>
      <div className="user-card__badge">
        <span className="user-card__badge-dot" />
        Active
      </div>
    </div>
  );
};

export default UserCard;
