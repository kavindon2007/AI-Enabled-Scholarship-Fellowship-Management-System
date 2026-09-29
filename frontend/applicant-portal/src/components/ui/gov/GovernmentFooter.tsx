import React from 'react';
import { Link } from 'react-router-dom';

const GovernmentFooter: React.FC = () => {
  return (
    <footer className="bg-gov-blue-dark text-white pt-10 pb-6 border-t-4 border-gov-orange">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4">AI-SFMS</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              AI-Enabled Scholarship and Fellowship Management System for Scheduled Tribes.
            </p>
            <p className="text-sm text-gray-300 mt-2">
              Ministry of Tribal Affairs, Government of India.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-gov-orange-light">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About AI-SFMS</Link></li>
              <li><Link to="/schemes" className="hover:text-white transition-colors">Scholarship Schemes</Link></li>
              <li><Link to="/announcements" className="hover:text-white transition-colors">Announcements</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-gov-orange-light">Support</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/help" className="hover:text-white transition-colors">Help / FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/grievance" className="hover:text-white transition-colors">Grievance Redressal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-4 text-gov-orange-light">Policies</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accessibility Statement</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Copyright Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm text-gray-400">
          <p>
            This is a prototype demonstration for SIH 2026. 
            Not an official government website.
          </p>
          <p className="mt-2">
            &copy; {new Date().getFullYear()} Ministry of Tribal Affairs (Demo). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default GovernmentFooter;
