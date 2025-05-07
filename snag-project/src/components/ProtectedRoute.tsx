import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/hooks/useAuth';
import { ROUTES } from '../lib/constants/routes';
import AccessDenied from './AccessDenied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, profile, loading, isAuthenticated } = useAuth();

  console.log('ProtectedRoute: Auth state:', {
    loading,
    isAuthenticated,
    hasUser: !!user,
    hasProfile: !!profile,
    userRole: profile?.role,
    allowedRoles
  });

  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated || !user) {
    console.log('ProtectedRoute: No authenticated user, redirecting to login');
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Si no hay perfil, redirigir al login
  if (!profile) {
    console.log('ProtectedRoute: No profile found, redirecting to login');
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Si hay roles permitidos especificados y el usuario no tiene el rol adecuado
  if (allowedRoles && !allowedRoles.includes(profile.role.toLowerCase())) {
    console.log('ProtectedRoute: User role not allowed', {
      userRole: profile.role,
      allowedRoles
    });
    return <AccessDenied />;
  }

  // Si todo está bien, renderizar el componente hijo
  return <>{children}</>;
};

export default ProtectedRoute;
