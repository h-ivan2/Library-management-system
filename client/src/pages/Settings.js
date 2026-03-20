import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import {
  BellIcon,
  LockClosedIcon,
  UserCircleIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Settings = () => {
  const { user, isAdmin, fetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState('general');

  // Tabs available to everyone
  const userTabs = [
    { id: 'general', name: 'General', icon: UserCircleIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: LockClosedIcon },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
  ];

  // Extra tabs only for admins
  const adminTabs = isAdmin ? [
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
  ] : [];

  const tabs = [...userTabs, ...adminTabs];

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
              <GeneralSettings user={user} fetchUser={fetchUser} />
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
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Use the dark mode toggle in the sidebar or top bar to switch between light and dark themes.
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-sm">
                  <div className="border-2 border-primary-500 rounded-lg p-3 text-center cursor-pointer">
                    <div className="h-12 bg-white border border-gray-200 rounded mb-2"></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Light</p>
                  </div>
                  <div className="border-2 border-gray-300 rounded-lg p-3 text-center cursor-pointer">
                    <div className="h-12 bg-gray-900 rounded mb-2"></div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Dark</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'privacy' && isAdmin && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Privacy Settings</h2>
                <div className="space-y-4">
                  <NotificationItem
                    title="Activity logging"
                    description="Log all admin actions for audit purposes"
                    defaultEnabled={true}
                  />
                  <NotificationItem
                    title="Data sharing"
                    description="Share anonymized usage data to improve the system"
                    defaultEnabled={false}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// General settings with editable name/email for all users
const GeneralSettings = ({ user, fetchUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/profile/me', formData);
      toast.success('Settings saved successfully');
      setIsEditing(false);
      await fetchUser();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || '', email: user?.email || '' });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">General Settings</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            disabled={!isEditing}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input-field disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            disabled={!isEditing}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input-field disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Language
          </label>
          <select disabled={!isEditing} className="input-field w-full md:w-64 disabled:opacity-60 disabled:cursor-not-allowed">
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
          <select disabled={!isEditing} className="input-field w-full md:w-64 disabled:opacity-60 disabled:cursor-not-allowed">
            <option>UTC-8 (Pacific Time)</option>
            <option>UTC-5 (Eastern Time)</option>
            <option>UTC+0 (London)</option>
            <option>UTC+1 (Central Europe)</option>
            <option>UTC+2 (East Africa)</option>
          </select>
        </div>

        {isEditing && (
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <CheckIcon className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary flex items-center space-x-2"
            >
              <XMarkIcon className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

const NotificationItem = ({ title, description, defaultEnabled }) => {
  const [enabled, setEnabled] = useState(defaultEnabled);

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
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