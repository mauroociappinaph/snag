import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/hooks/useAuth';
import { ROUTES } from '../lib/constants/routes';
import type { UserRole } from '../lib/types/database.types';
import AccessDenied from './AccessDenied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  // Si hay roles permitidos especificados y el usuario no tiene el rol adecuado
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
