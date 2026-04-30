import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import InputField from '../components/auth/InputField';
import AuthButton from '../components/auth/AuthButton';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../services/auth.service';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resetSuccess = searchParams.get('reset') === 'success';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { data } = await loginApi(form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      icon="◈"
      title="Welcome Back"
      subtitle="Sign in to continue your conversations"
      onSubmit={handleSubmit}
    >
      {resetSuccess && <div className="success-message">Password updated — you can now sign in.</div>}
      <ErrorMessage message={serverError} />

      <InputField
        id="email" name="email" label="Email Address" type="email"
        placeholder="john@example.com" value={form.email}
        onChange={handleChange} error={errors.email} autoComplete="email"
      />

      <InputField
        id="password" name="password" label="Password" type="password"
        labelRight={<Link to="/forgot-password" className="auth-link">Forgot password?</Link>}
        placeholder="Your password" value={form.password}
        onChange={handleChange} error={errors.password} autoComplete="current-password"
      />

      <AuthButton type="submit" loading={loading}>Sign In</AuthButton>

      <div className="auth-footer">
        Don&apos;t have an account?{' '}<Link to="/register">Create one</Link>
      </div>
    </AuthForm>
  );
};

export default Login;
