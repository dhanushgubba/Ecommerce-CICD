import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const userEmail = localStorage.getItem('userEmail');

  // Additional check to clear any stale data
  useEffect(() => {
    if (!isAuthenticated || !userEmail || isAuthenticated !== 'true') {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAuthenticated');
    }
  }, [isAuthenticated, userEmail]);

  // Check if user is authenticated
  if (!isAuthenticated || !userEmail || isAuthenticated !== 'true') {
    // Clear any stale data and redirect
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isAuthenticated');
    return <Navigate to="/Login" replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
