import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const ConfirmModal = ({ title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onCancel, loading }) => {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onCancel]);

  return createPortal(
    <div className="confirm-modal-backdrop" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3 className="confirm-modal__title">{title}</h3>
        {message && <p className="confirm-modal__message">{message}</p>}
        <div className="confirm-modal__actions">
          <button
            type="button"
            className="confirm-modal__btn confirm-modal__btn--cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`confirm-modal__btn${danger ? ' confirm-modal__btn--danger' : ' confirm-modal__btn--confirm'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmModal;
