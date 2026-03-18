import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpenIcon, 
  UserIcon,
  CalendarIcon,
  IdentificationIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowing, setBorrowing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    available: true
  });

  const fetchBookDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/books/${id}`);
      setBook(response.data);
      setEditFormData({
        title: response.data.title,
        author: response.data.author,
        isbn: response.data.isbn,
        available: response.data.available
      });
    } catch (error) {
      toast.error('Book not found');
      navigate('/books');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  const handleBorrow = async () => {
    setBorrowing(true);
    try {
      await axios.post('/borrow/borrow', {
        userId: user.id,
        bookId: book._id
      });
      toast.success('Book borrowed successfully!');
      fetchBookDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to borrow book');
    } finally {
      setBorrowing(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/books/${book._id}`, editFormData);
      toast.success('Book updated successfully');
      setShowEditModal(false);
      fetchBookDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update book');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/books/${book._id}`);
      toast.success('Book deleted successfully');
      navigate('/books');
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!book) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/books')}
        className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6 transition-colors group"
      >
        <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Books</span>
      </button>

      {/* Book Details Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{book.title}</h1>
              <p className="text-primary-100 text-lg">by {book.author}</p>
            </div>
            {isAdmin && (
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                  title="Edit book"
                >
                  <PencilIcon className="h-5 w-5 text-white" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                  title="Delete book"
                >
                  <TrashIcon className="h-5 w-5 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Status Badge */}
          <div className="mb-6">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
              book.available 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {book.available ? (
                <>
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Available for Borrowing
                </>
              ) : (
                <>
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  Currently Borrowed
                </>
              )}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <DetailField
              icon={BookOpenIcon}
              label="Title"
              value={book.title}
            />
            <DetailField
              icon={UserIcon}
              label="Author"
              value={book.author}
            />
            <DetailField
              icon={IdentificationIcon}
              label="ISBN"
              value={book.isbn}
              isMono
            />
            <DetailField
              icon={CalendarIcon}
              label="Added to Library"
              value={new Date(book.created_at || Date.now()).toLocaleDateString()}
            />
          </div>

          {/* Additional Info */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Book ID</p>
                  <p className="font-mono text-sm text-gray-900">{book._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`font-medium ${book.available ? 'text-green-600' : 'text-red-600'}`}>
                    {book.available ? 'Available' : 'Borrowed'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {book.available && (
            <div className="border-t pt-6 mt-6">
              <button
                onClick={handleBorrow}
                disabled={borrowing}
                className="btn-primary w-full md:w-auto px-8 py-3 text-lg disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {borrowing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <DocumentDuplicateIcon className="h-5 w-5" />
                    <span>Borrow This Book</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Edit Book</h3>
            <form onSubmit={handleEdit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.author}
                    onChange={(e) => setEditFormData({ ...editFormData, author: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ISBN *
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.isbn}
                    onChange={(e) => setEditFormData({ ...editFormData, isbn: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability
                  </label>
                  <select
                    value={editFormData.available}
                    onChange={(e) => setEditFormData({ ...editFormData, available: e.target.value === 'true' })}
                    className="input-field"
                  >
                    <option value="true">Available</option>
                    <option value="false">Borrowed</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Update Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Book</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<span className="font-semibold">{book.title}</span>"? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailField = ({ icon: Icon, label, value, isMono }) => (
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

export default BookDetails;