import React from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../../store/useAuthStore';
import { Menu, User, LogOut, FileText, Home, Info, BookOpen, ShieldAlert } from 'lucide-react';
import AccessibilityToolbar from './AccessibilityToolbar';
import LanguageSelector from './LanguageSelector';

const GovernmentHeader: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="w-full shadow-gov sticky top-0 z-50">
      {/* Top Utility Bar */}
      <div className="bg-gov-blue-dark text-white text-xs py-1 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            <span className="hidden sm:inline">Government of India | Ministry of Tribal Affairs</span>
            <span className="sm:hidden">Govt. of India | MoTA</span>
          </div>
          <div className="flex space-x-4 items-center">
            <Link to="#main-content" className="hover:underline focus:outline-none focus:ring-2 focus:ring-white">Skip to Main Content</Link>
            <AccessibilityToolbar />
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* Main Identity Area */}
      <div className="bg-white py-4 px-4 sm:px-6 lg:px-8 border-b border-gov-border">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-16 bg-gov-blue-light rounded flex items-center justify-center text-white font-bold shrink-0">
              {/* Placeholder for State Emblem */}
              Emblem
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gov-blue leading-tight">
                AI-Enabled Scholarship & Fellowship Management System
              </h1>
              <p className="text-sm text-gov-textMuted hidden sm:block">
                For Scheduled Tribes, Ministry of Tribal Affairs
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="bg-gov-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-12">
            <div className="hidden md:flex space-x-1">
              <NavLink to="/" icon={<Home className="w-4 h-4" />}>Home</NavLink>
              <NavLink to="/about" icon={<Info className="w-4 h-4" />}>About Us</NavLink>
              <NavLink to="/schemes" icon={<BookOpen className="w-4 h-4" />}>Schemes</NavLink>
              <NavLink to="/announcements" icon={<ShieldAlert className="w-4 h-4" />}>Announcements</NavLink>
              <NavLink to="/ocr-demo" icon={<FileText className="w-4 h-4" />}>OCR Demo Lab</NavLink>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard" className="text-sm font-medium hover:text-gov-orange-light transition-colors">
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-2 border-l border-white/20 pl-4">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user?.name}</span>
                    <button onClick={logout} className="ml-2 text-white hover:text-red-300 focus:outline-none" aria-label="Logout">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/auth/login" className="bg-white text-gov-blue hover:bg-gray-100 px-4 py-1 rounded font-medium text-sm transition-colors">
                    Login
                  </Link>
                  <Link to="/auth/register" className="bg-gov-orange hover:bg-gov-orange-light text-white px-4 py-1 rounded font-medium text-sm transition-colors">
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden w-full justify-between">
              <span className="font-medium text-sm">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-gov-orange-light focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gov-blue-dark border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink to="/">Home</MobileNavLink>
              <MobileNavLink to="/about">About Us</MobileNavLink>
              <MobileNavLink to="/schemes">Schemes</MobileNavLink>
              <MobileNavLink to="/announcements">Announcements</MobileNavLink>
              <MobileNavLink to="/ocr-demo">OCR Demo Lab</MobileNavLink>
              <div className="border-t border-white/20 pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    <MobileNavLink to="/dashboard">Dashboard</MobileNavLink>
                    <button onClick={logout} className="block w-full text-left px-3 py-2 text-base font-medium text-red-300 hover:bg-white/10 rounded-md">
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <MobileNavLink to="/auth/login">Login</MobileNavLink>
                    <MobileNavLink to="/auth/register">Register</MobileNavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

const NavLink = ({ to, children, icon }: { to: string, children: React.ReactNode, icon?: React.ReactNode }) => (
  <Link
    to={to}
    className="flex items-center px-3 py-2 text-sm font-medium hover:bg-gov-blue-light transition-colors group"
  >
    {icon && <span className="mr-2 opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>}
    {children}
  </Link>
);

const MobileNavLink = ({ to, children }: { to: string, children: React.ReactNode }) => (
  <Link
    to={to}
    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gov-blue-light transition-colors"
  >
    {children}
  </Link>
);

export default GovernmentHeader;
