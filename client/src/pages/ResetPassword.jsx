import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import InputField from '../components/auth/InputField';
import AuthButton from '../components/auth/AuthButton';
import ErrorMessage from '../components/common/ErrorMessage';
import { resetPasswordApi } from '../services/auth.service';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [form, setForm] = useState({ password: '', confirm: '' });
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
    if (!token) { setServerError('Invalid or missing reset token.'); return; }
    const errs = {};
    if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (!form.confirm) errs.confirm = 'Please confirm your password';
    else if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await resetPasswordApi(token, form.password);
      navigate('/login?reset=success');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Reset failed. The link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      icon="🔑"
      title="Reset Password"
      subtitle="Choose a strong new password for your account"
      onSubmit={handleSubmit}
    >
      <ErrorMessage message={serverError} />

      <InputField
        id="password" name="password" label="New Password" type="password"
        placeholder="Min. 6 characters" value={form.password}
        onChange={handleChange} error={errors.password} autoComplete="new-password"
      />

      <InputField
        id="confirm" name="confirm" label="Confirm New Password" type="password"
        placeholder="Repeat your new password" value={form.confirm}
        onChange={handleChange} error={errors.confirm} autoComplete="new-password"
      />

      <AuthButton type="submit" loading={loading}>Reset Password</AuthButton>

      <div className="auth-footer">
        <Link to="/login">← Back to sign in</Link>
      </div>
    </AuthForm>
  );
};

export default ResetPassword;
