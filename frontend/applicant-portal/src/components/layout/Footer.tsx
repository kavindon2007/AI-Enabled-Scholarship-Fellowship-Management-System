import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between text-center pb-12 sm:pb-0">
          <div className="flex justify-center space-x-6 md:order-2">
            <a href="#" className="text-sm text-gray-400 hover:text-gray-500">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-gray-500">
              Privacy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-gray-500">
              Help
            </a>
          </div>
          <div className="mt-4 md:mt-0 md:order-1">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} AI-SFMS Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
