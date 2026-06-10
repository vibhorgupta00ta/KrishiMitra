import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { useTranslation } from 'react-i18next';

export function Register() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      // Save user info and token
      localStorage.setItem('krishimitra_user', JSON.stringify(response.data));
      
      // Redirect to profile with auto-refresh
      window.location.href = '/profile';
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. User might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">{t('auth_register_title')}</CardTitle>
          <CardDescription className="text-center">
            {t('auth_register_subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="error" className="mb-4">
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="name"
                name="name"
                type="text"
                label={t('auth_name')}
                placeholder="Ramesh Kumar"
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
                label={t('auth_email')}
                placeholder="farmer@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                name="password"
                type="password"
                label={t('auth_password')}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t('auth_btn_registering') : t('auth_btn_register')}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-slate-600">
            {t('auth_has_account')}{' '}
            <Link to="/login" className="text-green-600 hover:underline">
              {t('auth_btn_login')}
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
