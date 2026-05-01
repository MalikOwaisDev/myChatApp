const OnlineStatus = ({ online, size = 10 }) => (
  <span
    className={`online-status${online ? ' online-status--online' : ' online-status--offline'}`}
    style={{ width: size, height: size }}
    aria-label={online ? 'Online' : 'Offline'}
  />
);

export default OnlineStatus;
