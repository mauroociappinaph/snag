import { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import type { UserRole } from '../types/auth.types';
import { supabaseService } from '../supabase/supabaseClient';

export const useAuth = () => {
  const {
    user,
    profile,
    isAuthenticated,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    setError,
    setLoading
  } = useAuthStore();

  // Verificar la sesión al montar el componente
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabaseService.getSession();
        if (!session && !loading) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setLoading(false);
      }
    };

    checkSession();
  }, [loading, setLoading]);

  const hasRole = (role: UserRole) => profile?.role === role;
  const isAdmin = hasRole('Admin');
  const isBusiness = hasRole('Business');
  const isClient = hasRole('Client');

  const canAccess = (allowedRoles: UserRole[]) => {
    if (!profile) return false;
    return allowedRoles.includes(profile.role);
  };

  return {
    // State
    user,
    profile,
    isAuthenticated,
    loading,
    error,

    // Role checks
    hasRole,
    isAdmin,
    isBusiness,
    isClient,
    canAccess,

    // Actions
    signIn,
    signUp,
    signOut,
    setError
  };
};
