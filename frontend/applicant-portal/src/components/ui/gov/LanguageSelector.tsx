import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'ta', name: 'தமிழ்' }
  ];

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative border-l border-white/20 pl-4 ml-4 hidden sm:block">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 hover:text-gov-orange-light focus:outline-none transition-colors"
      >
        <Languages className="w-3.5 h-3.5" />
        <span className="font-medium">
          {languages.find(l => l.code === i18n.language)?.name || 'English'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-lg ring-1 ring-black ring-opacity-5 z-50 text-gray-800">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${i18n.language === lang.code ? 'font-bold text-gov-blue' : ''}`}
                role="menuitem"
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
