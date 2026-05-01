import { useRef } from 'react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const MediaUpload = ({ onMedia, disabled }) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (!ACCEPTED_TYPES.includes(file.type)) return;

    const reader = new FileReader();
    reader.onload = () => onMedia(reader.result, file.type);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <button
        type="button"
        className="msg-input__media-btn"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        aria-label="Attach image"
      >
        <ImageIcon />
      </button>
    </>
  );
};

export default MediaUpload;
