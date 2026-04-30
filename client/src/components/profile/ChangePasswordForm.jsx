import { useState } from 'react';
import InputField from '../auth/InputField';
import ErrorMessage from '../common/ErrorMessage';
import { changePasswordApi } from '../../services/user.service';

const ChangePasswordForm = () => {
  const [form, setForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    const errs = {};
    if (!form.oldPassword) errs.oldPassword = 'Current password is required';
    if (!form.newPassword) errs.newPassword = 'New password is required';
    else if (form.newPassword.length < 6) errs.newPassword = 'Minimum 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm new password';
    else if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await changePasswordApi({ oldPassword: form.oldPassword, newPassword: form.newPassword });
      setSuccess('Password changed successfully');
      setForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Password change failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-card">
      <h2 className="profile-card__title">Change Password</h2>
      <form onSubmit={handleSubmit} noValidate>
        <ErrorMessage message={serverError} />
        {success && <div className="success-message">{success}</div>}

        <InputField id="oldPassword" name="oldPassword" label="Current Password" type="password"
          placeholder="Your current password" value={form.oldPassword}
          onChange={handleChange} error={errors.oldPassword} autoComplete="current-password" />

        <InputField id="newPassword" name="newPassword" label="New Password" type="password"
          placeholder="Min. 6 characters" value={form.newPassword}
          onChange={handleChange} error={errors.newPassword} autoComplete="new-password" />

        <InputField id="confirmPassword" name="confirmPassword" label="Confirm New Password" type="password"
          placeholder="Repeat new password" value={form.confirmPassword}
          onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" />

        <button type="submit" className="profile-btn" disabled={loading}>
          {loading ? 'Updating...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
