import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Simple components for testing
const Books = () => <div className="p-8"><h1 className="text-2xl font-bold">Books Page</h1></div>;
const Borrow = () => <div className="p-8"><h1 className="text-2xl font-bold">Borrow Page</h1></div>;
const Profile = () => <div className="p-8"><h1 className="text-2xl font-bold">Profile Page</h1></div>;
const Users = () => <div className="p-8"><h1 className="text-2xl font-bold">Users Page (Admin Only)</h1></div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/books" element={<PrivateRoute><Books /></PrivateRoute>} />
            <Route path="/borrow" element={<PrivateRoute><Borrow /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;