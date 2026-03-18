import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
  IdentificationIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ShieldCheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [borrowHistory, setBorrowHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchBorrowHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await axios.get('/borrow/my-books');
      setBorrowHistory(response.data || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleShowHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory && borrowHistory.length === 0) {
      fetchBorrowHistory();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put('/profile/me', formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      // Refresh user data by logging in again (this will trigger fetchUser in AuthContext)
      await login(user.email, '');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-t-2xl p-8 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-primary-600">
              {getInitials(user?.name)}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-primary-100">{user?.email}</p>
            <div className="flex items-center mt-2 space-x-2">
              <span className="inline-flex items-center px-3 py-1 bg-primary-500 rounded-full text-sm">
                <ShieldCheckIcon className="h-4 w-4 mr-1" />
                {user?.role === 'admin' ? 'Administrator' : 'Library Member'}
              </span>
              <span className="inline-flex items-center px-3 py-1 bg-primary-500 rounded-full text-sm">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Joined {new Date(user?.created_at || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="bg-white rounded-b-2xl shadow-xl p-8">
        {!isEditing ? (
          // View Mode
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
              >
                <PencilIcon className="h-5 w-5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField
                icon={UserCircleIcon}
                label="Full Name"
                value={user?.name}
              />
              <InfoField
                icon={EnvelopeIcon}
                label="Email Address"
                value={user?.email}
              />
              <InfoField
                icon={IdentificationIcon}
                label="User ID"
                value={user?.id}
                isMono
              />
              <InfoField
                icon={CalendarIcon}
                label="Member Since"
                value={new Date(user?.created_at || Date.now()).toLocaleDateString()}
              />
            </div>

            {/* Borrow History Toggle */}
            <div className="border-t pt-6">
              <button
                onClick={handleShowHistory}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-lg font-semibold text-gray-900">Borrowing History</span>
                <span className="text-primary-600">{showHistory ? '▼' : '▶'}</span>
              </button>

              {showHistory && (
                <div className="mt-4">
                  {historyLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                  ) : borrowHistory.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No borrowing history yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {borrowHistory.map((borrow) => (
                        <div key={borrow._id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{borrow.book?.title}</h4>
                              <p className="text-sm text-gray-600">by {borrow.book?.author}</p>
                            </div>
                            {borrow.returned_at ? (
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                Returned
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                                Active
                              </span>
                            )}
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              Borrowed: {new Date(borrow.borrowed_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-600">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              Due: {new Date(borrow.due_date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Edit Mode
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Edit Profile</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> To change your password, please contact the administrator.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="btn-secondary flex items-center space-x-2"
              >
                <XMarkIcon className="h-5 w-5" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center space-x-2"
              >
                <CheckIcon className="h-5 w-5" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const InfoField = ({ icon: Icon, label, value, isMono }) => (
  <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
    <div className="p-2 bg-primary-100 rounded-lg">
      <Icon className="h-5 w-5 text-primary-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-600">{label}</p>
      <p className={`font-medium text-gray-900 truncate ${isMono ? 'font-mono text-sm' : ''}`}>
        {value}
      </p>
    </div>
  </div>
);

export default Profile;