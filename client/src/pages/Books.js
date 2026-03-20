import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  XMarkIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({ title: '', author: '', isbn: '' });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [limit] = useState(9);
  
  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchAuthor, setSearchAuthor] = useState('');
  const [searchIsbn, setSearchIsbn] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const { isAdmin } = useAuth();

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/books?page=${currentPage}&limit=${limit}`);
      setBooks(response.data.books || []);
      setCurrentPage(response.data.currentPage || 1);
      setTotalPages(response.data.totalPages || 1);
      setTotalBooks(response.data.totalBooks || 0);
    } catch (error) {
      toast.error('Failed to fetch books');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]);

  const searchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit,
        ...(searchQuery && { query: searchQuery }),
        ...(searchAuthor && { author: searchAuthor }),
        ...(searchIsbn && { isbn: searchIsbn })
      });

      const response = await axios.get(`/books/search?${params}`);
      setBooks(response.data.books || []);
      setCurrentPage(response.data.currentPage || 1);
      setTotalPages(response.data.totalPages || 1);
      setTotalBooks(response.data.totalBooks || 0);
    } catch (error) {
      toast.error('Search failed');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit, searchQuery, searchAuthor, searchIsbn]);

  useEffect(() => {
    if (isSearching) {
      searchBooks();
    } else {
      fetchBooks();
    }
  }, [currentPage, isSearching, fetchBooks, searchBooks]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchAuthor('');
    setSearchIsbn('');
    setIsSearching(false);
    setCurrentPage(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await axios.put(`/books/${editingBook._id}`, formData);
        toast.success('Book updated successfully');
      } else {
        await axios.post('/books', formData);
        toast.success('Book added successfully');
      }
      setShowModal(false);
      setEditingBook(null);
      setFormData({ title: '', author: '', isbn: '' });
      if (isSearching) {
        searchBooks();
      } else {
        fetchBooks();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    
    try {
      await axios.delete(`/books/${id}`);
      toast.success('Book deleted successfully');
      if (isSearching) {
        searchBooks();
      } else {
        fetchBooks();
      }
    } catch (error) {
      toast.error('Failed to delete book');
    }
  };

  if (loading && books.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Books Collection</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Total {totalBooks} books available</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => {
              setEditingBook(null);
              setFormData({ title: '', author: '', isbn: '' });
              setShowModal(true);
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add New Book</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or author..."
                className="input-field pl-10"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="btn-primary px-6"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary px-4"
              >
                <FunnelIcon className="h-5 w-5" />
              </button>
              {isSearching && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="btn-secondary px-4"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={searchAuthor}
                  onChange={(e) => setSearchAuthor(e.target.value)}
                  placeholder="Filter by author..."
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ISBN
                </label>
                <input
                  type="text"
                  value={searchIsbn}
                  onChange={(e) => setSearchIsbn(e.target.value)}
                  placeholder="Filter by ISBN..."
                  className="input-field"
                />
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No books found</h3>
          <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or add new books.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <div key={book._id || book.id} className="card group">
                <Link to={`/books/${book._id || book.id}`} className="block p-6">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      book.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {book.available ? 'Available' : 'Borrowed'}
                    </span>
                    {isAdmin && (
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingBook(book);
                            setFormData({
                              title: book.title,
                              author: book.author,
                              isbn: book.isbn
                            });
                            setShowModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(book._id);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">by {book.author}</p>
                  <p className="text-sm text-gray-500 font-mono">ISBN: {book.isbn}</p>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <span className="text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Book Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="input-field"
                      placeholder="Enter book title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Author *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="input-field"
                      placeholder="Enter author name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      ISBN *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.isbn}
                      onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                      className="input-field"
                      placeholder="Enter ISBN"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingBook(null);
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingBook ? 'Update Book' : 'Add Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;