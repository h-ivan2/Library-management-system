import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BellIcon,
  LockClosedIcon,
  UserCircleIcon,
  PaintBrushIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', name: 'General', icon: UserCircleIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: LockClosedIcon },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account preferences</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar tabs */}
          <div className="md:w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <nav className="p-4 space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="mr-3 h-5 w-5" />
                  {tab.name}
                  <ChevronRightIcon className="ml-auto h-4 w-4" />
                </button>
              ))}
            </nav>
          </div>

          {/* Content area */}
          <div className="flex-1 p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Language
                    </label>
                    <select className="input-field w-full md:w-64">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Timezone
                    </label>
                    <select className="input-field w-full md:w-64">
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC+0 (London)</option>
                      <option>UTC+1 (Central Europe)</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email notifications</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Receive email updates about your account</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                      <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Preferences</h2>
                <div className="space-y-4">
                  <NotificationItem 
                    title="Due date reminders"
                    description="Get notified when books are due soon"
                    defaultEnabled={true}
                  />
                  <NotificationItem 
                    title="Overdue notifications"
                    description="Receive alerts for overdue books"
                    defaultEnabled={true}
                  />
                  <NotificationItem 
                    title="New book arrivals"
                    description="Get updates when new books are added"
                    defaultEnabled={false}
                  />
                  <NotificationItem 
                    title="System announcements"
                    description="Important updates about the library system"
                    defaultEnabled={true}
                  />
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h2>
                <div className="space-y-4">
                  <button className="btn-primary">Change Password</button>
                  <button className="btn-secondary">Enable Two-Factor Authentication</button>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Active Sessions</h3>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Current session • {new Date().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationItem = ({ title, description, defaultEnabled }) => {
  const [enabled, setEnabled] = useState(defaultEnabled);

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{title}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <button
        onClick={() => setEnabled(!enabled)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          enabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

export default Settings;