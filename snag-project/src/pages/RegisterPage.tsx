import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/hooks/useAuthStore';
import { ROUTES } from '../lib/constants/routes';
import type { UserRole } from '../lib/types/database.types';
import { supabaseService } from '../lib/supabase/supabaseClient';

const RegisterPage: React.FC = () => {
  console.log('RegisterPage rendering');
  const { loading: authLoading, error: authError, signOut, isAuthenticated, user, profile } = useAuth();
  console.log('Auth state:', {
    authLoading,
    authError,
    isAuthenticated,
    userId: user?.id,
    profile: profile ? `profile exists with role ${profile.role}` : 'no profile'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'client' as UserRole
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationAttempted, setRegistrationAttempted] = useState(false);

  // Verificar si hay un usuario ya autenticado
  useEffect(() => {
    if (isAuthenticated && user && !registrationAttempted) {
      console.log('Already authenticated user detected, showing warning.');
      setLocalError('Ya hay una sesión activa. Por favor, cierra sesión antes de registrar una nueva cuenta.');
    }
  }, [isAuthenticated, user, registrationAttempted]);

  console.log('Current component state:', {
    isLoading,
    registrationAttempted,
    localError
  });

  const handleSignOut = async () => {
    try {
      console.log('Signing out current user before registration');
      await signOut();
      setLocalError(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', { ...formData, password: '***' });
    setLocalError(null);
    setIsLoading(true);
    setRegistrationAttempted(true);

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    const selectedRole = formData.role;

    try {
      console.log('Attempting to sign up user with email:', formData.email);

      // 1. Sign up the user in Supabase Auth
      const { data: authData, error: signUpError } = await supabaseService.signUp(
        formData.email,
        formData.password
      );

      console.log('Sign up response:', {
        success: !!authData,
        hasUser: !!authData?.user,
        hasError: !!signUpError,
        errorMessage: signUpError?.message
      });

      if (signUpError) {
        // Handle the specific case of already registered user
        if (signUpError.message.includes('User already registered')) {
          console.log('User already registered error detected');
          setLocalError('Este correo electrónico ya está registrado. Por favor usa otro o inicia sesión.');
          setIsLoading(false);
          return;
        }
        throw signUpError;
      }

      if (authData?.user) {
        console.log('User created successfully, ID:', authData.user.id);
        console.log('Now creating profile with role:', formData.role);

        // 2. Create user profile with name and role
        const { error: profileError } = await supabaseService.createUserProfile(
          authData.user.id,
          formData.email,
          formData.name,
          formData.role
        );

        if (profileError) {
          console.error('Error creating profile:', profileError);
          throw new Error('Error al crear el perfil de usuario. Por favor, inténtalo de nuevo.');
        }

        console.log('User profile created successfully:', {
          id: authData.user.id,
          name: formData.name,
          role: formData.role
        });

        // Navegar inmediatamente según el rol seleccionado
        console.log('Navigating directly based on role:', selectedRole);

        if (selectedRole === 'business') {
          window.location.href = '/business/dashboard';
        } else if (selectedRole === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/dashboard';
        }

        return; // Importante: detener la ejecución aquí para evitar actualizaciones de estado después de la navegación
      } else {
        // If no user was created in the auth step
        console.error('No user was created in auth step');
        throw new Error('No se pudo crear la cuenta. Por favor, inténtalo de nuevo.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setLocalError(err instanceof Error ? err.message : 'Error durante el registro');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Si el usuario está en medio del proceso de registro (isLoading es true)
  if (isLoading && registrationAttempted) {
    console.log('Rendering loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full">
          <div className="text-center">
            <div className="mb-4 mx-auto">
              <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Creando cuenta...</h2>
            <p className="text-gray-600">Por favor espera mientras procesamos tu registro.</p>
            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  if (formData.role === 'business') {
                    window.location.href = '/business/dashboard';
                  } else if (formData.role === 'admin') {
                    window.location.href = '/admin/dashboard';
                  } else {
                    window.location.href = '/dashboard';
                  }
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
              >
                Ir al dashboard manualmente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('Rendering registration form');
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Crear cuenta
          </h1>

          {isAuthenticated && !registrationAttempted && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
              <p className="mb-2">Ya hay una sesión activa. Debes cerrar sesión antes de crear una nueva cuenta.</p>
              <button
                onClick={handleSignOut}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium w-full"
              >
                Cerrar sesión actual
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {(authError || localError) && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {localError || (authError ? String(authError) : '')}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                required
                disabled={isLoading || authLoading || (isAuthenticated && !registrationAttempted)}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
                disabled={isLoading || authLoading || (isAuthenticated && !registrationAttempted)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                  disabled={isLoading || authLoading || (isAuthenticated && !registrationAttempted)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                  disabled={isLoading || authLoading || (isAuthenticated && !registrationAttempted)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
                disabled={isLoading || authLoading || (isAuthenticated && !registrationAttempted)}
              >
                <option value="business">Negocio</option>
                <option value="client">Cliente</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || authLoading || (isAuthenticated && !registrationAttempted)}
            >
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>

            <p className="text-center text-gray-600 text-sm">
              ¿Ya tienes una cuenta?{' '}
              <Link to={ROUTES.LOGIN} className="text-blue-500 hover:text-blue-600 font-medium">
                Iniciar sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
