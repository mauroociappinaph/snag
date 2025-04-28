import { useAuthStore } from '../../stores/authStore';
import type { UserRole } from '../types/database.types';

export const useAuth = () => {
  const {
    user,
    profile,
    isAuthenticated,
    role,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    setError,
  } = useAuthStore();

  const isAdmin = role === 'admin';
  const isBusiness = role === 'business';
  const isClient = role === 'client';

  const hasRole = (requiredRole: UserRole) => role === requiredRole;
  const hasAnyRole = (roles: UserRole[]) => roles.includes(role as UserRole);

  return {
    // State
    user,
    profile,
    isAuthenticated,
    role,
    loading,
    error,

    // Actions
    signIn,
    signUp,
    signOut,
    setError,

    // Role checks
    isAdmin,
    isBusiness,
    isClient,
    hasRole,
    hasAnyRole,
  };
};
