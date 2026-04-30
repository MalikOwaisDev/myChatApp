import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import InputField from '../components/auth/InputField';
import AuthButton from '../components/auth/AuthButton';
import ErrorMessage from '../components/common/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import { registerApi } from '../services/auth.service';

const validate = (form) => {
  const errs = {};
  if (!form.name.trim()) errs.name = 'Name is required';
  if (!form.username.trim()) errs.username = 'Username is required';
  else if (/\s/.test(form.username)) errs.username = 'No spaces allowed';
  if (!form.email.trim()) errs.email = 'Email is required';
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
  if (!form.password) errs.password = 'Password is required';
  else if (form.password.length < 6) errs.password = 'Minimum 6 characters';
  if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
  else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
  return errs;
};

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirmPassword: '' });
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
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { data } = await registerApi({ name: form.name, username: form.username, email: form.email, password: form.password });
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      icon="✦"
      title="Create Account"
      subtitle="Join the conversation — it's free"
      onSubmit={handleSubmit}
    >
      <ErrorMessage message={serverError} />

      <InputField id="name" name="name" label="Full Name" type="text"
        placeholder="John Doe" value={form.name} onChange={handleChange} error={errors.name} autoComplete="name" />

      <InputField id="username" name="username" label="Username" type="text"
        placeholder="johndoe" value={form.username} onChange={handleChange} error={errors.username} autoComplete="username" />

      <InputField id="email" name="email" label="Email Address" type="email"
        placeholder="john@example.com" value={form.email} onChange={handleChange} error={errors.email} autoComplete="email" />

      <InputField id="password" name="password" label="Password" type="password"
        placeholder="Min. 6 characters" value={form.password} onChange={handleChange} error={errors.password} autoComplete="new-password" />

      <InputField id="confirmPassword" name="confirmPassword" label="Confirm Password" type="password"
        placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" />

      <AuthButton type="submit" loading={loading}>Create Account</AuthButton>

      <div className="auth-footer">
        Already have an account?{' '}<Link to="/login">Sign in</Link>
      </div>
    </AuthForm>
  );
};

export default Register;
