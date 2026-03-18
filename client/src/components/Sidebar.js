import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  HomeIcon,
  BookOpenIcon,
  BookmarkIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen, onClose, darkMode, toggleDarkMode }) => {
  const { user, isAdmin, logout } = useAuth();

  // Define navigation items
  const navigation = [
    { name: 'Dashboard', to: '/', icon: HomeIcon },
    { name: 'Books', to: '/books', icon: BookOpenIcon },
    { name: 'My Borrows', to: '/borrow', icon: BookmarkIcon }
  ];

  // Admin only navigation items
  const adminNavigation = isAdmin ? [
    { name: 'Users', to: '/users', icon: UserGroupIcon },
    { name: 'Reports', to: '/reports', icon: ChartBarIcon },
    { name: 'Settings', to: '/settings', icon: Cog6ToothIcon }
  ] : [];

  // Combine navigation based on role
  const allNavigation = [...navigation, ...adminNavigation];

  const handleLogout = () => {
    logout();
    onClose();
  };

  // Function to get navigation link classes
  const getNavLinkClass = ({ isActive }) => {
    const baseClasses = "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors w-full";
    if (isActive) {
      return `${baseClasses} bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300`;
    }
    return `${baseClasses} text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800`;
  };

  // Function to get icon classes
  const getIconClass = (isActive) => {
    if (isActive) {
      return "mr-3 h-5 w-5 text-primary-600 dark:text-primary-400";
    }
    return "mr-3 h-5 w-5 text-gray-400 dark:text-gray-500";
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* User Info */}
      <div className="flex items-center space-x-3 p-4 mb-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg text-white">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-primary-600">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
          <p className="text-xs text-primary-100 truncate">{user?.email || 'user@example.com'}</p>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="flex items-center px-3 py-2.5 mb-4 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 w-full"
        type="button"
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? (
          <>
            <SunIcon className="mr-3 h-5 w-5 text-yellow-500" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <MoonIcon className="mr-3 h-5 w-5 text-gray-600" />
            <span>Dark Mode</span>
          </>
        )}
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {allNavigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={getNavLinkClass}
            end={item.to === '/'}
          >
            {({ isActive }) => (
              <>
                <item.icon className={getIconClass(isActive)} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center px-3 py-2.5 mt-4 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 w-full"
        type="button"
      >
        <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
        Logout
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-gray-900/50 transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex justify-end p-4">
              <button 
                onClick={onClose} 
                className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                type="button"
                aria-label="Close sidebar"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="px-4 pb-4 h-[calc(100%-4rem)] overflow-y-auto">
              <NavContent />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 h-screen overflow-y-auto">
          <NavContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;