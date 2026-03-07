import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bars3Icon,
  BellIcon,
  SunIcon,
  MoonIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const TopBar = ({ onMenuClick, darkMode, setDarkMode, user }) => {
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const notifications = [
    { id: 1, text: 'Book "The Great Gatsby" is due tomorrow', time: '5 min ago', read: false },
    { id: 2, text: 'New book added to collection', time: '1 hour ago', read: true },
    { id: 3, text: 'Your borrowed book has been returned', time: '2 hours ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 transition-colors duration-300">
      {/* Mobile menu button */}
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
      </button>

      {/* Search bar */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <div className="relative w-full max-w-md">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books..."
              className="input-field pl-10 w-full bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Right side items */}
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          {darkMode ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <BellIcon className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden z-50">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                  >
                    <p className="text-sm text-gray-900 dark:text-white">{notification.text}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile link */}
        <Link to="/profile" className="flex items-center gap-x-2">
          <span className="hidden lg:flex lg:items-center">
            <span className="text-sm font-semibold text-gray-900 dark:text-white" aria-hidden="true">
              {user?.name}
            </span>
          </span>
          <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TopBar;