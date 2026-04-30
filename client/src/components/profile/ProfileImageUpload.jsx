import { useRef } from 'react';

const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const ProfileImageUpload = ({ image, name, onChange }) => {
  const inputRef = useRef(null);

  const initials = name
    ? name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="profile-avatar" onClick={() => inputRef.current?.click()} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()} aria-label="Upload profile photo">
      {image ? (
        <img src={image} alt="Profile" className="profile-avatar__img" />
      ) : (
        <div className="profile-avatar__initials">{initials}</div>
      )}
      <div className="profile-avatar__overlay">
        <CameraIcon />
        <span>Change Photo</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFile}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </div>
  );
};

export default ProfileImageUpload;
