import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  if (!isAuthenticated) {
    toast.error('Please login to access this feature');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;