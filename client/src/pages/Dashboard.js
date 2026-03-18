import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpenIcon, 
  UsersIcon, 
  BookmarkIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentBooks, setRecentBooks] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  const { user, isAdmin } = useAuth();

  const fetchDashboardData = useCallback(async () => {
    try {
      setDashboardError(null);
      
      // Fetch recent books
      const booksRes = await axios.get('/books?page=1&limit=6');
      setRecentBooks(booksRes.data.books || []);

      // Fetch user's borrowed books
      try {
        const borrowsRes = await axios.get('/borrow/my-books');
        setMyBorrows(borrowsRes.data || []);
      } catch (err) {
        console.log('No borrows yet or error fetching:', err);
        setMyBorrows([]);
      }

      // Fetch stats if admin
      if (isAdmin) {
        try {
          const statsRes = await axios.get('/statistics/dashboard');
          setStats(statsRes.data);
        } catch (err) {
          console.log('Stats not available:', err);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const getOverdueCount = () => {
    return myBorrows.filter(borrow => borrow.isOverdue).length;
  };

  const getDueStatus = (borrow) => {
    if (borrow.isOverdue) {
      return {
        text: 'Overdue',
        color: 'text-red-600',
        bg: 'bg-red-100',
        icon: ExclamationTriangleIcon
      };
    }
    
    const daysLeft = borrow.daysUntilDue;
    if (daysLeft <= 3) {
      return {
        text: `${daysLeft} days left`,
        color: 'text-orange-600',
        bg: 'bg-orange-100',
        icon: ClockIcon
      };
    }
    return {
      text: `${daysLeft} days left`,
      color: 'text-green-600',
      bg: 'bg-green-100',
      icon: ClockIcon
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600">{dashboardError}</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl shadow-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-primary-100 text-lg">
          {isAdmin 
            ? 'Manage your library system efficiently.' 
            : 'Discover your next great read from our collection.'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin && stats ? (
          // Admin Stats
          <>
            <StatCard
              icon={BookOpenIcon}
              label="Total Books"
              value={stats.totalBooks}
              color="blue"
            />
            <StatCard
              icon={BookmarkIcon}
              label="Available"
              value={stats.availableBooks}
              color="green"
            />
            <StatCard
              icon={ClockIcon}
              label="Borrowed"
              value={stats.borrowedBooks}
              color="yellow"
            />
            <StatCard
              icon={UsersIcon}
              label="Total Users"
              value={stats.totalUsers}
              color="purple"
            />
          </>
        ) : !isAdmin && (
          // User Stats
          <>
            <StatCard
              icon={BookmarkIcon}
              label="Currently Borrowed"
              value={myBorrows.length}
              color="blue"
            />
            <StatCard
              icon={ExclamationTriangleIcon}
              label="Overdue Books"
              value={getOverdueCount()}
              color="red"
            />
            <StatCard
              icon={BookOpenIcon}
              label="Available Books"
              value={recentBooks.filter(b => b.available).length}
              color="green"
            />
            <StatCard
              icon={ArrowTrendingUpIcon}
              label="Total Borrowed"
              value={myBorrows.length}
              color="purple"
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Books */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Books</h2>
              <Link to="/books" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                View All <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {recentBooks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No books available</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentBooks.map((book) => (
                  <Link
                    key={book._id}
                    to={`/books/${book._id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      book.available 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {book.available ? 'Available' : 'Borrowed'}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* My Borrows */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">My Borrows</h2>
              <Link to="/borrow" className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
                View All <ChevronRightIcon className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            {myBorrows.length === 0 ? (
              <div className="text-center py-8">
                <BookmarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No books borrowed</p>
                <Link to="/books" className="btn-primary inline-block mt-4">
                  Browse Books
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myBorrows.slice(0, 3).map((borrow) => {
                  const status = getDueStatus(borrow);
                  const StatusIcon = status.icon;
                  
                  return (
                    <div key={borrow._id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {borrow.book?.title || 'Unknown Book'}
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Due: {new Date(borrow.due_date).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs flex items-center ${status.bg} ${status.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {status.text}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin: Most Borrowed Books */}
      {isAdmin && stats?.mostBorrowed?.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Most Borrowed Books</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.mostBorrowed.map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{item.book?.title || 'Unknown'}</p>
                  <p className="text-sm text-gray-600">Borrowed {item.count} times</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;