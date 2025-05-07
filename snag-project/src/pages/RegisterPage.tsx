import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/hooks/useAuth';
import { ROUTES } from '../lib/constants/routes';
import type { UserRole } from '../lib/types/database.types';
import { supabaseService } from '../lib/supabase/supabaseClient';

const RegisterPage: React.FC = () => {
  console.log('RegisterPage rendering');
  const { loading: authLoading, error: authError, signOut, isAuthenticated, user, profile } = useAuth();
  console.log('AUTH DEBUG - RegisterPage - Auth state:', {
    authLoading,
    authError,
    isAuthenticated,
    userId: user?.id,
    profileExists: !!profile,
    role: profile?.role || 'no role'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Client' as UserRole
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationAttempted, setRegistrationAttempted] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number | null>(null);

  // Verificar si hay un usuario ya autenticado
  useEffect(() => {
    if (isAuthenticated && user && !registrationAttempted) {
      console.log('AUTH DEBUG - Already authenticated user detected, showing warning.');
      setLocalError('Ya hay una sesión activa. Por favor, cierra sesión antes de registrar una nueva cuenta.');
    }
  }, [isAuthenticated, user, registrationAttempted]);

  // Efecto para el contador de redirección automática
  useEffect(() => {
    if (redirectCountdown !== null && redirectCountdown > 0) {
      console.log(`AUTH DEBUG - Redirect countdown: ${redirectCountdown} seconds remaining`);
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (redirectCountdown === 0) {
      console.log('AUTH DEBUG - Redirect countdown reached zero, redirecting now');
      const role = formData.role;

      if (role === 'Business') {
        console.log('AUTH DEBUG - Redirecting to business dashboard');
        window.location.href = '/business/dashboard';
      } else if (role === 'Admin') {
        console.log('AUTH DEBUG - Redirecting to admin dashboard');
        window.location.href = '/admin/dashboard';
      } else {
        console.log('AUTH DEBUG - Redirecting to client dashboard');
        window.location.href = '/dashboard';
      }
    }
  }, [redirectCountdown, formData.role]);

  console.log('AUTH DEBUG - Current component state:', {
    isLoading,
    registrationAttempted,
    redirectCountdown,
    localError
  });

  const handleSignOut = async () => {
    try {
      console.log('AUTH DEBUG - Signing out current user before registration');
      await signOut();
      console.log('AUTH DEBUG - User successfully signed out');
      setLocalError(null);
    } catch (error) {
      console.error('AUTH DEBUG - Error signing out:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('AUTH DEBUG - Form submitted with data:', {
      name: formData.name,
      email: formData.email,
      role: formData.role
    });
    setLocalError(null);
    setIsLoading(true);
    setRegistrationAttempted(true);

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    const selectedRole = formData.role;
    console.log(`AUTH DEBUG - Selected role: ${selectedRole}`);

    try {
      console.log('AUTH DEBUG - Attempting to sign up user with email:', formData.email);

      // 1. Sign up the user in Supabase Auth
      const { data: authData, error: signUpError } = await supabaseService.signUp(
        formData.email,
        formData.password
      );

      console.log('AUTH DEBUG - Sign up response:', {
        success: !!authData,
        hasUser: !!authData?.user,
        userId: authData?.user?.id || 'no user ID',
        hasError: !!signUpError,
        errorMessage: signUpError?.message || 'no error'
      });

      if (signUpError) {
        // Handle the specific case of already registered user
        if (signUpError.message.includes('User already registered')) {
          console.log('AUTH DEBUG - User already registered error detected');
          setLocalError('Este correo electrónico ya está registrado. Por favor usa otro o inicia sesión.');
          setIsLoading(false);
          return;
        }
        throw signUpError;
      }

      if (!authData?.user) {
        console.error('AUTH DEBUG - No user was created in auth step');
        throw new Error('No se pudo crear la cuenta. Por favor, inténtalo de nuevo.');
      }

      console.log('AUTH DEBUG - User created successfully, ID:', authData.user.id);
      console.log('AUTH DEBUG - Now creating profile with role:', formData.role);

      // 2. Create user profile with name and role
      const { error: profileError } = await supabaseService.createUserProfile(
        authData.user.id,
        formData.name,
        formData.role
      );

      if (profileError) {
        console.error('AUTH DEBUG - Error creating profile:', profileError);
        // Aunque haya error en crear el perfil, ya está autenticado, así que iniciamos la redirección
        console.log('AUTH DEBUG - Despite profile error, starting redirect countdown');
        setRedirectCountdown(5);
        return;
      }

      console.log('AUTH DEBUG - User profile created successfully:', {
        id: authData.user.id,
        name: formData.name,
        role: formData.role
      });

      // Iniciar cuenta regresiva para redirección automática
      console.log('AUTH DEBUG - Starting automatic redirect countdown');
      setRedirectCountdown(5); // 5 segundos

      // Obtener la sesión actual para verificar que todo esté correcto
      const { data: sessionData } = await supabaseService.getSession();
      console.log('AUTH DEBUG - Current session after signup:', {
        hasSession: !!sessionData.session,
        userId: sessionData.session?.user?.id || 'no user ID'
      });

      // Recuperar el perfil recién creado para verificar
      if (sessionData.session?.user) {
        const { data: profileData } = await supabaseService.getUserProfile(sessionData.session.user.id);
        console.log('AUTH DEBUG - Retrieved profile after creation:', {
          hasProfile: !!profileData,
          role: profileData?.role || 'no role'
        });
      }
    } catch (err) {
      console.error('AUTH DEBUG - Registration error:', err);
      if (err instanceof Error) {
        setLocalError(err.message);
      } else if (err && typeof err === 'object' && 'message' in err) {
        setLocalError(String((err as {message: unknown}).message));
      } else {
        setLocalError('Error durante el registro');
      }
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
    console.log('AUTH DEBUG - Rendering loading/success state');
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
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Cuenta creada exitosamente</h2>
            {redirectCountdown !== null ? (
              <p className="text-gray-600">
                Redirigiendo al dashboard en {redirectCountdown} segundos...
              </p>
            ) : (
              <p className="text-gray-600">
                Tu cuenta ha sido creada. Ya puedes acceder al dashboard.
              </p>
            )}
            <div className="mt-4 space-y-2">
              <button
                onClick={() => {
                  console.log('AUTH DEBUG - Manual redirect button clicked');
                  const role = formData.role;

                  console.log(`AUTH DEBUG - Manual redirect to role: ${role}`);
                  if (role === 'Business') {
                    window.location.href = '/business/dashboard';
                  } else if (role === 'Admin') {
                    window.location.href = '/admin/dashboard';
                  } else {
                    window.location.href = '/dashboard';
                  }
                }}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
              >
                Ir al dashboard ahora
              </button>
              <div className="mt-2 text-xs text-gray-500">
                <p>Estado de autenticación:</p>
                <p>Autenticado: {isAuthenticated ? 'Sí' : 'No'}</p>
                <p>Usuario ID: {user?.id || 'No disponible'}</p>
                <p>Perfil: {profile ? `${profile.role}` : 'No disponible'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('AUTH DEBUG - Rendering registration form');
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
                <option value="Business">Negocio</option>
                <option value="Client">Cliente</option>
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
