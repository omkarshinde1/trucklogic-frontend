import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Local storage madhun token check karne
  const token = localStorage.getItem('token');

  if (!token) {
    // Jar token nsel, tar direct '/login' page var redirect kar (Dashboard dakhvu nako)
    return <Navigate to="/login" replace />;
  }

  // Jar token asel, tar je page magitlay (Dashboard) te dakhv
  return children;
};

export default ProtectedRoute;