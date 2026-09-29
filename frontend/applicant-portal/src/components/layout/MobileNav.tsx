import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, FileText, UploadCloud, User } from 'lucide-react';
import { cn } from '../common/Button';

const MobileNav: React.FC = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Apps', path: '/applications', icon: FileText },
    { name: 'Docs', path: '/documents', icon: UploadCloud },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-40 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex flex-col items-center justify-center w-full h-full space-y-1',
              isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
            )}
          >
            {({ isActive }) => {
              const Icon = item.icon;
              return (
                <>
                  <Icon className={cn('h-5 w-5', isActive ? 'text-primary-600' : 'text-gray-400')} />
                  <span className="text-[10px] font-medium">{item.name}</span>
                </>
              );
            }}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
