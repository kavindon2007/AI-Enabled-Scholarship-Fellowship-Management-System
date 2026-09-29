import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, User, LogOut, Menu, X, Languages } from 'lucide-react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useNotificationStore from '../../store/useNotificationStore';

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const [showLanguagesMenu, setShowLanguagesMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleLanguages = (lang: string) => {
    i18n.changeLanguage(lang);
    setShowLanguagesMenu(false);
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'mr', name: 'मराठी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'മലയാളം' },
    { code: 'ta', name: 'தமிழ்' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center sm:hidden">
            <span className="font-bold text-xl text-primary-600">AI-SFMS</span>
          </div>

          <div className="hidden sm:flex sm:items-center sm:ml-auto">
            {/* Languages Selector */}
            <div className="relative ml-3">
              <button
                onClick={() => setShowLanguagesMenu(!showLanguagesMenu)}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-600 focus:outline-none"
              >
                <Languages className="h-5 w-5 mr-1 text-gray-400" />
                <span className="hidden md:block">
                  {languages.find(l => l.code === i18n.language)?.name || 'English'}
                </span>
              </button>

              {showLanguagesMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-40">
                  <div className="grid grid-cols-2 gap-1 p-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => toggleLanguages(lang.code)}
                        className={`block px-3 py-2 text-sm text-left rounded-md ${
                          i18n.language === lang.code ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button className="relative p-2 ml-4 text-gray-400 hover:text-gray-500">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 block w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative ml-4">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                  {user?.name?.charAt(0) || <User className="h-5 w-5" />}
                </div>
              </button>

              {showProfileMenu && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 z-40">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowProfileMenu(false)}
                  >
                    {t('profile', 'Profile')}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    {t('logout', 'Logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
