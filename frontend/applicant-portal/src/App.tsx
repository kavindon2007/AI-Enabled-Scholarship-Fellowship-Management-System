import React, { useEffect } from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import GovernmentHeader from './components/ui/gov/GovernmentHeader';
import GovernmentFooter from './components/ui/gov/GovernmentFooter';

const App: React.FC = () => {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    // Check if user is already logged in based on token
    initAuth();
  }, [initAuth]);

  return (
    <div className="flex flex-col min-h-screen bg-gov-bg font-sans text-gov-text">
      <GovernmentHeader />
      
      <main id="main-content" className="flex-1 w-full mx-auto focus:outline-none">
        <Outlet />
      </main>

      <GovernmentFooter />
      <ScrollRestoration />
    </div>
  );
};

export default App;
