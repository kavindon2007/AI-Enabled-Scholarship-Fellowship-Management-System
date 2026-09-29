import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  FileText,
  UploadCloud,
  CreditCard,
  MessageSquare,
  User,
  GraduationCap
} from 'lucide-react';
import { cn } from '../common/Button';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();

  const navItems = [
    { name: t('dashboard', 'Dashboard'), path: '/', icon: Home },
    { name: t('applications', 'My Applications'), path: '/applications', icon: FileText },
    { name: t('documents', 'Documents'), path: '/documents', icon: UploadCloud },
    { name: t('disbursements', 'Disbursements'), path: '/disbursements', icon: CreditCard },
    { name: t('grievances', 'Grievances'), path: '/grievances', icon: MessageSquare },
    { name: t('profile', 'Profile'), path: '/profile', icon: User },
  ];

  return (
    <div className="hidden sm:flex sm:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white pt-5 pb-4">
        <div className="flex items-center flex-shrink-0 px-4 mb-5">
          <GraduationCap className="h-8 w-8 text-primary-600 mr-2" />
          <span className="font-bold text-xl text-gray-900 tracking-tight">AI-SFMS</span>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1 bg-white">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => cn(
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center px-2 py-2.5 text-sm font-medium rounded-md transition-colors'
                )}
              >
                {({ isActive }) => {
                  const Icon = item.icon;
                  return (
                    <>
                      <Icon
                        className={cn(
                          isActive ? 'text-primary-700' : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 flex-shrink-0 h-5 w-5 transition-colors'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </>
                  );
                }}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
