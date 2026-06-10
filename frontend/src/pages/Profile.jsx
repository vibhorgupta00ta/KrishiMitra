import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { useTranslation } from 'react-i18next';

export function Profile() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', contactNumber: '', profilePic: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Read user from localStorage for token
  const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('krishimitra_user'));
    return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const headers = getAuthHeader();
        if (!headers.Authorization) {
          setError('Not authenticated. Please log in.');
          setFetching(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/farmer/profile', { headers });
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          contactNumber: response.data.contactNumber || '',
          profilePic: response.data.profilePic || ''
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile.');
      } finally {
        setFetching(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const headers = getAuthHeader();
      const response = await axios.put('http://localhost:5000/api/farmer/profile', {
        name: formData.name,
        contactNumber: formData.contactNumber,
        profilePic: formData.profilePic
      }, { headers });

      // Update local storage name if it was changed
      const user = JSON.parse(localStorage.getItem('krishimitra_user'));
      if (user) {
        user.name = response.data.name;
        user.profilePic = response.data.profilePic;
        localStorage.setItem('krishimitra_user', JSON.stringify(user));
        window.dispatchEvent(new Event('userProfileUpdated'));
      }

      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="text-center py-20">Loading profile...</div>;
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">{t('prof_title')}</CardTitle>
          <CardDescription className="text-center">
            {t('prof_subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success" className="mb-4 bg-green-50 text-green-700 border-green-200">
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-green-100 mb-4 flex items-center justify-center">
                {formData.profilePic ? (
                  <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400 text-3xl">{formData.name ? formData.name.charAt(0).toUpperCase() : '?'}</span>
                )}
              </div>
              <label className="cursor-pointer text-sm text-green-600 hover:text-green-700 font-medium">
                {t('prof_upload_pic')}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  label={t('auth_name')}
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label={t('auth_email_ro')}
                  value={formData.email}
                  disabled={true} // Email should usually be read-only on simple profiles
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="contactNumber"
                  name="contactNumber"
                  type="text"
                  label={t('prof_contact')}
                  placeholder="+91 9876543210"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? t('prof_saving') : t('prof_save')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
