import { useUI } from '../../context/UIContext';

const icons = { success: '✓', error: '✕', info: 'i', warning: '!' };

const Toast = () => {
  const { toasts, removeToast } = useUI();
  if (!toasts.length) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`} role="alert">
          <span className="toast__icon">{icons[toast.type] ?? icons.info}</span>
          <span className="toast__message">{toast.message}</span>
          <button className="toast__close" onClick={() => removeToast(toast.id)} aria-label="Dismiss">×</button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
