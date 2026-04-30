const ProfileHeader = ({ user }) => {
  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="profile-header">
      <div className="profile-header__avatar">
        {user?.profileImage ? (
          <img src={user.profileImage} alt={user.name} className="profile-header__img" />
        ) : (
          <div className="profile-header__initials">{initials}</div>
        )}
      </div>
      <div className="profile-header__info">
        <h1 className="profile-header__name">{user?.name}</h1>
        <p className="profile-header__username">@{user?.username}</p>
        <p className="profile-header__email">{user?.email}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
