import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';

const App: React.FC = () => {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    // Check if user is already logged in based on token
    initAuth();
  }, [initAuth]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
        <Footer />
        <MobileNav />
      </div>
    </div>
  );
};

export default App;
