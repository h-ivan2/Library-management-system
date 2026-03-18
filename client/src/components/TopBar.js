import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Bars3Icon,
  BellIcon,
  SunIcon,
  MoonIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const TopBar = ({ onMenuClick, darkMode, toggleDarkMode }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const { user } = useAuth();

  // Handle click outside for notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const notifications = [
    { id: 1, text: 'Book "The Great Gatsby" is due tomorrow', time: '5 min ago', read: false },
    { id: 2, text: 'New book added to collection', time: '1 hour ago', read: true }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 shadow-sm">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        type="button"
        aria-label="Open menu"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search books..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Search books"
          />
        </div>
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          type="button"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            type="button"
            aria-label="Notifications"
          >
            <BellIcon className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                        !notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      }`}
                    >
                      <p className="text-sm text-gray-900 dark:text-white">{notification.text}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <Link to="/profile" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          </div>
          <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">
            {user?.name || 'User'}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;