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
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const Sidebar = ({ isOpen, onClose, darkMode }) => {
  const { user, isAdmin, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', to: '/', icon: HomeIcon, exact: true },
    { name: 'Books', to: '/books', icon: BookOpenIcon },
    { name: 'My Borrows', to: '/borrow', icon: BookmarkIcon },
    ...(isAdmin ? [
      { name: 'Users', to: '/users', icon: UserGroupIcon },
      { name: 'Reports', to: '/reports', icon: ChartBarIcon },
      { name: 'Settings', to: '/settings', icon: Cog6ToothIcon },
    ] : []),
  ];

  const bottomNavigation = [
    { name: 'Profile', to: '/profile', icon: UserCircleIcon },
  ];

  const handleLogout = () => {
    logout();
  };

  const NavItems = () => (
    <>
      {/* User Info */}
      <div className="flex items-center space-x-3 px-4 py-5 mb-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
          <span className="text-xl font-bold text-primary-600">
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-primary-100 truncate">{user?.email}</p>
          <span className="inline-flex mt-1 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
            {user?.role === 'admin' ? 'Administrator' : 'Member'}
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            onClick={onClose}
            className={({ isActive }) => `
              group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
              ${isActive 
                ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 shadow-sm' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`
                  mr-3 h-5 w-5 transition-colors
                  ${isActive 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                  }
                `} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4 px-3">
        {bottomNavigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => `
              group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 mb-1
              ${isActive 
                ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`
                  mr-3 h-5 w-5
                  ${isActive 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400'
                  }
                `} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
        
        {/* Logout Button */}
        <button
          onClick={() => {
            handleLogout();
            onClose();
          }}
          className="w-full group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-red-500 dark:text-red-400" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 px-4 pb-4 pt-24 shadow-xl ring-1 ring-gray-900/10">
                  <NavItems />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 px-4 pb-4 pt-24 shadow-lg">
          <NavItems />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;