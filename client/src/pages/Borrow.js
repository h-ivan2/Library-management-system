import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpenIcon, 
  ArrowPathIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const Borrow = () => {
  const [availableBooks, setAvailableBooks] = useState([]);
  const [myBorrows, setMyBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [booksRes, borrowsRes] = await Promise.all([
        axios.get('/books?limit=100'),
        axios.get('/borrow/my-books').catch(() => ({ data: [] }))
      ]);
      
      setAvailableBooks(booksRes.data.books?.filter(book => book.available) || []);
      setMyBorrows(borrowsRes.data || []);
    } catch (error) {
      toast.error('Failed to fetch data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBorrow = async () => {
    if (!selectedBook) return;
    
    setActionLoading(true);
    try {
      await axios.post('/borrow/borrow', {
        userId: user.id,
        bookId: selectedBook._id
      });
      toast.success('Book borrowed successfully!');
      setShowConfirmModal(false);
      setSelectedBook(null);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to borrow book');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async (bookId) => {
    try {
      const response = await axios.post('/borrow/return', {
        userId: user.id,
        bookId
      });
      
      if (response.data.fine && response.data.fine !== 'No fine') {
        toast.success(`Book returned. ${response.data.fine}`);
      } else {
        toast.success('Book returned successfully!');
      }
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return book');
    }
  };

  const getDueDateStatus = (borrow) => {
    if (borrow.isOverdue) {
      return {
        color: 'text-red-600',
        bg: 'bg-red-100',
        icon: ExclamationTriangleIcon,
        text: 'Overdue'
      };
    }
    
    const daysLeft = borrow.daysUntilDue;
    if (daysLeft <= 3) {
      return {
        color: 'text-orange-600',
        bg: 'bg-orange-100',
        icon: ClockIcon,
        text: `${daysLeft} days left`
      };
    }
    return {
      color: 'text-green-600',
      bg: 'bg-green-100',
      icon: CheckCircleIcon,
      text: `${daysLeft} days left`
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Borrow Books</h1>
        <p className="text-gray-600 mt-1">Browse available books and manage your borrowings</p>
      </div>

      {/* My Borrowed Books Section */}
      {myBorrows.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <BookOpenIcon className="h-6 w-6 mr-2 text-primary-600" />
            My Borrowed Books ({myBorrows.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myBorrows.map((borrow) => {
              const status = getDueDateStatus(borrow);
              const StatusIcon = status.icon;
              const book = borrow.book;
              
              return (
                <div key={borrow._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-1 text-xs font-semibold rounded ${status.bg} ${status.color} flex items-center`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {status.text}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                      {book?.title || 'Unknown Book'}
                    </h3>
                    <p className="text-gray-600 mb-3">by {book?.author || 'Unknown Author'}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Borrowed: {new Date(borrow.borrowed_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        Due: {new Date(borrow.due_date).toLocaleDateString()}
                      </div>
                    </div>

                    <button
                      onClick={() => handleReturn(book._id)}
                      className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                      <ArrowPathIcon className="h-5 w-5" />
                      <span>Return Book</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Available Books Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <BookOpenIcon className="h-6 w-6 mr-2 text-primary-600" />
          Available Books ({availableBooks.length})
        </h2>
        
        {availableBooks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No books available</h3>
            <p className="text-gray-600">All books are currently borrowed. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableBooks.map((book) => (
              <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">{book.title}</h3>
                  <p className="text-gray-600 mb-4">by {book.author}</p>
                  <p className="text-sm text-gray-500 mb-4 font-mono">ISBN: {book.isbn}</p>
                  <button
                    onClick={() => {
                      setSelectedBook(book);
                      setShowConfirmModal(true);
                    }}
                    className="w-full btn-primary"
                  >
                    Borrow This Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedBook && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Confirm Borrow</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to borrow "<span className="font-semibold">{selectedBook.title}</span>"?
              <br /><br />
              <span className="text-sm">
                Due date will be 14 days from today. Please return on time to avoid fines.
              </span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedBook(null);
                }}
                className="btn-secondary"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleBorrow}
                disabled={actionLoading}
                className="btn-primary"
              >
                {actionLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Confirm Borrow'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Borrow;