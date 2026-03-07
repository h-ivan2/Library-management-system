import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const { user } = useAuth();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300`}>
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        darkMode={darkMode}
      />
      
      <div className="lg:pl-72">
        <TopBar 
          onMenuClick={() => setSidebarOpen(true)} 
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
        />
        
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-4 sm:px-6 lg:px-8 mt-auto">
          <div className="max-w-7xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Library Management System. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;