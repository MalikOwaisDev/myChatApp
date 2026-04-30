import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import InputField from '../components/auth/InputField';
import AuthButton from '../components/auth/AuthButton';
import ErrorMessage from '../components/common/ErrorMessage';
import { forgotPasswordApi } from '../services/auth.service';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Enter a valid email address');
      return;
    }
    setEmailError('');
    setLoading(true);
    try {
      const { data } = await forgotPasswordApi(email);
      setSuccess(data.message);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      icon="✉"
      title="Forgot Password"
      subtitle="Enter your email and we'll send a reset link"
      onSubmit={handleSubmit}
    >
      <ErrorMessage message={serverError} />
      {success && <div className="success-message">{success}</div>}

      <InputField
        id="email" name="email" label="Email Address" type="email"
        placeholder="john@example.com" value={email}
        onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
        error={emailError} autoComplete="email"
      />

      <AuthButton type="submit" loading={loading}>Send Reset Link</AuthButton>

      <div className="auth-footer">
        <Link to="/login">← Back to sign in</Link>
      </div>
    </AuthForm>
  );
};

export default ForgotPassword;
