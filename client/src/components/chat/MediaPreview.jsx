const MediaPreview = ({ src, onRemove }) => (
  <div className="media-preview">
    <img src={src} alt="Preview" className="media-preview__img" />
    <button
      type="button"
      className="media-preview__remove"
      onClick={onRemove}
      aria-label="Remove image"
    >
      ×
    </button>
  </div>
);

export default MediaPreview;
