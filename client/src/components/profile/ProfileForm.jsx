import { useState, useEffect } from 'react';
import InputField from '../auth/InputField';
import ErrorMessage from '../common/ErrorMessage';
import ProfileImageUpload from './ProfileImageUpload';
import { updateProfileApi } from '../../services/user.service';
import { useAuth } from '../../context/AuthContext';

const ProfileForm = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', username: '' });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', username: user.username || '' });
      setImage(user.profileImage || null);
    }
  }, [user]);

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
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.username.trim()) errs.username = 'Username is required';
    else if (/\s/.test(form.username)) errs.username = 'No spaces allowed';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const { data } = await updateProfileApi({ name: form.name, username: form.username, profileImage: image });
      updateUser(data.user);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-card">
      <h2 className="profile-card__title">Edit Profile</h2>
      <form onSubmit={handleSubmit} noValidate>
        <ErrorMessage message={serverError} />
        {success && <div className="success-message">{success}</div>}

        <div className="profile-image-section">
          <ProfileImageUpload image={image} name={form.name} onChange={setImage} />
        </div>

        <InputField id="name" name="name" label="Full Name" type="text"
          placeholder="John Doe" value={form.name} onChange={handleChange} error={errors.name} />

        <InputField id="username" name="username" label="Username" type="text"
          placeholder="johndoe" value={form.username} onChange={handleChange} error={errors.username} />

        <button type="submit" className="profile-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
