import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sprout, LogIn, User, Menu, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTranslation } from 'react-i18next';

export function Navbar() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const userStr = localStorage.getItem('krishimitra_user');
    return userStr ? JSON.parse(userStr) : null;
  });

  useEffect(() => {
    const handleUserUpdate = () => {
      const userStr = localStorage.getItem('krishimitra_user');
      setUser(userStr ? JSON.parse(userStr) : null);
    };

    window.addEventListener('userProfileUpdated', handleUserUpdate);
    return () => window.removeEventListener('userProfileUpdated', handleUserUpdate);
  }, []);

  const isAuthenticated = !!user;

  const handleLogout = () => {
    localStorage.removeItem('krishimitra_user');
    setIsDropdownOpen(false);
    window.location.href = '/login';
  };

  const navLinks = [
    { name: t('nav_home'), path: '/' },
    { name: t('nav_dashboard'), path: '/dashboard' },
    { name: t('nav_predict_crop'), path: '/crop-prediction' },
    { name: t('nav_detect_disease') || 'Disease Detection', path: '/detect-disease' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-green-700">
          <Sprout className="h-8 w-8" />
          <span className="text-xl font-bold tracking-tight">{t('app_name')}</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-green-600 ${
                  location.pathname === link.path ? 'text-green-700' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}
              className="text-sm font-bold text-green-700 hover:bg-green-50 px-2 py-1 rounded border border-green-200 transition-colors"
            >
              {i18n.language === 'en' ? 'हिन्दी' : 'EN'}
            </button>
            {isAuthenticated ? (
              <div className="relative">
                {/* Invisible overlay to close dropdown when clicking outside */}
                {isDropdownOpen && (
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsDropdownOpen(false)}
                  ></div>
                )}
                
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="relative z-50 flex items-center justify-center h-10 w-10 rounded-full bg-green-600 text-white font-bold text-lg hover:bg-green-700 transition-colors focus:outline-none shadow-sm overflow-hidden"
                >
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    user?.name ? user.name.charAt(0).toUpperCase() : 'U'
                  )}
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-slate-200">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="mr-2 h-4 w-4" />
                      {t('nav_profile')}
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('nav_logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>{t('nav_login')}</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation Toggle (Placeholder) */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6 text-slate-700" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
