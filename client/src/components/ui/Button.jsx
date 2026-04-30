import Loader from './Loader';

const Button = ({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) => (
  <button
    className={['btn', `btn--${variant}`, `btn--${size}`, className].filter(Boolean).join(' ')}
    disabled={loading || props.disabled}
    {...props}
  >
    {loading ? <Loader size={size === 'sm' ? 14 : 18} /> : children}
  </button>
);

export default Button;
