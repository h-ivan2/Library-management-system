import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useDarkMode } from '../hooks/useDarkMode';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <div className="lg:pl-64">
          <TopBar
            onMenuClick={() => setSidebarOpen(true)}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />

          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;