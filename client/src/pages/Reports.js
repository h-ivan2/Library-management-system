import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DocumentArrowDownIcon,
  CalendarIcon,
  ChartBarIcon,
  BookOpenIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

const Reports = () => {
  const [dateRange, setDateRange] = useState('week');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/statistics/dashboard');
      setReportData(response.data);
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { 
      name: 'Total Books', 
      value: reportData?.totalBooks || 0, 
      change: '+12%', 
      changeType: 'increase',
      icon: BookOpenIcon 
    },
    { 
      name: 'Active Borrowers', 
      value: reportData?.activeBorrows || 0, 
      change: '+8%', 
      changeType: 'increase',
      icon: UserGroupIcon 
    },
    { 
      name: 'Books Borrowed', 
      value: reportData?.borrowedBooks || 0, 
      change: '+23%', 
      changeType: 'increase',
      icon: ChartBarIcon 
    },
    { 
      name: 'Return Rate', 
      value: '94%', 
      change: '+5%', 
      changeType: 'increase',
      icon: ArrowTrendingUpIcon 
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Track your library's performance</p>
          </div>
          <button className="btn-primary flex items-center space-x-2">
            <DocumentArrowDownIcon className="h-5 w-5" />
            <span>Export Report</span>
          </button>
        </div>

        {/* Date Range Selector */}
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
            {['week', 'month', 'quarter', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                  dateRange === range
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <CalendarIcon className="h-5 w-5" />
            <span>Jan 1, 2024 - Mar 31, 2024</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                <stat.icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                stat.changeType === 'increase' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                  : 'bg-red-100 text-red-700'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.name}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Borrowed Books */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Most Borrowed Books</h2>
          <div className="space-y-4">
            {reportData?.mostBorrowed?.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold mr-3">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{item.book?.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Borrowed {item.count} times</p>
                </div>
                <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-600 rounded-full"
                    style={{ width: `${(item.count / reportData.mostBorrowed[0].count) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Distribution</h2>
          <div className="space-y-4">
            {['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography'].map((category, index) => (
              <div key={category} className="flex items-center">
                <div className="w-24 text-sm text-gray-600 dark:text-gray-400">{category}</div>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-600 rounded-full"
                      style={{ width: `${[85, 70, 60, 45, 30][index]}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {[85, 70, 60, 45, 30][index]}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mr-3">
                  <BookOpenIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <span className="font-medium">John Doe</span> borrowed <span className="font-medium">"The Great Gatsby"</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs rounded-full">
                  Borrowed
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;