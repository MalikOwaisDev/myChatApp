import { useState } from 'react';

const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const InputField = ({ label, labelRight, id, error, type = 'text', ...props }) => {
  const [visible, setVisible] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (visible ? 'text' : 'password') : type;

  return (
    <div className="input-group">
      {(label || labelRight) && (
        <div className={labelRight ? 'input-row-end' : ''}>
          {label && <label htmlFor={id} className="input-label">{label}</label>}
          {labelRight && labelRight}
        </div>
      )}
      <div className="input-wrapper">
        <input
          id={id}
          type={resolvedType}
          className={[
            'input-field',
            error ? 'input-field--error' : '',
            isPassword ? 'input-field--has-icon' : '',
          ].filter(Boolean).join(' ')}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="input-eye-btn"
            onClick={() => setVisible((v) => !v)}
            tabIndex={-1}
            aria-label={visible ? 'Hide password' : 'Show password'}
          >
            <EyeIcon open={visible} />
          </button>
        )}
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default InputField;
