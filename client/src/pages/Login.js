import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useDarkMode } from '../hooks/useDarkMode';
import { BookOpenIcon, EnvelopeIcon, LockClosedIcon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const { login } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@library.com');
      setPassword('admin123');
    } else {
      setEmail('user@library.com');
      setPassword('user123');
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Top bar with dark mode toggle */}
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-2">
            <BookOpenIcon className="h-7 w-7 text-primary-600" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">LibraryMS</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode
              ? <SunIcon className="h-5 w-5 text-yellow-400" />
              : <MoonIcon className="h-5 w-5" />
            }
          </button>
        </div>

        {/* Login card */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="bg-primary-100 dark:bg-primary-900/50 p-3 rounded-full">
                  <BookOpenIcon className="h-12 w-12 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome Back!</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to access the library</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <EnvelopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6">
              <button
                onClick={() => setShowDemo(!showDemo)}
                className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium w-full text-center"
              >
                {showDemo ? 'Hide' : 'Show'} Demo Credentials
              </button>

              {showDemo && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
                  <button
                    onClick={() => fillDemoCredentials('admin')}
                    className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">Admin Account</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">admin@library.com / admin123</div>
                  </button>
                  <button
                    onClick={() => fillDemoCredentials('user')}
                    className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-white">User Account</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">user@library.com / user123</div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;