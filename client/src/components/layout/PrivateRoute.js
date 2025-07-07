import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
