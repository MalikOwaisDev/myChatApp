import Loader from '../common/Loader';

const AuthButton = ({ children, loading, ...props }) => (
  <button className="auth-btn" disabled={loading} {...props}>
    {loading ? <Loader size={18} /> : children}
  </button>
);

export default AuthButton;
