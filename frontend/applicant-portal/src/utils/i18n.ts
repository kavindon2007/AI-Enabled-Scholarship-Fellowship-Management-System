import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Fallback resources - in production these should be loaded asynchronously via backend
const resources = {
  en: {
    translation: {
      welcome: 'Welcome to AI-SFMS',
      dashboard: 'Dashboard',
      applications: 'My Applications',
      documents: 'Documents',
      profile: 'Profile',
      logout: 'Logout'
    }
  },
  hi: {
    translation: {
      welcome: 'AI-SFMS में आपका स्वागत है',
      dashboard: 'डैशबोर्ड',
      applications: 'मेरे आवेदन',
      documents: 'दस्तावेज़',
      profile: 'प्रोफ़ाइल',
      logout: 'लॉग आउट'
    }
  },
  te: { translation: { welcome: 'AI-SFMS కు స్వాగతం', dashboard: 'డాష్‌బోర్డ్' } }, // Telugu
  ta: { translation: { welcome: 'AI-SFMS కు స్వాగతం', dashboard: 'డాష్‌బోర్డ్' } }, // Tamil placeholder
  mr: { translation: { welcome: 'AI-SFMS मध्ये आपले स्वागत आहे', dashboard: 'डॅशबोर्ड' } }, // Marathi
  bn: { translation: { welcome: 'AI-SFMS-এ স্বাগতম', dashboard: 'ড্যাশবোর্ড' } }, // Bengali
  gu: { translation: { welcome: 'AI-SFMS માં સ્વાગત છે', dashboard: 'ડેશબોર્ડ' } }, // Gujarati
  kn: { translation: { welcome: 'AI-SFMS ಗೆ ಸುಸ್ವಾಗತ', dashboard: 'ಡ್ಯಾಶ್ಬೋರ್ಡ್' } }, // Kannada
  ml: { translation: { welcome: 'AI-SFMS ലേക്ക് സ്വാഗതം', dashboard: 'ഡാഷ്‌ബോർഡ്' } }, // Malayalam
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'te', 'ta', 'mr', 'bn', 'gu', 'kn', 'ml'],
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
