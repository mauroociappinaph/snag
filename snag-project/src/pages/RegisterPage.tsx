import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/hooks/useAuth';
import { ROUTES } from '../lib/constants/routes';
import type { UserRole } from '../lib/types/database.types';
import { supabaseService } from '../lib/supabase/supabaseClient';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { loading: authLoading, error: authError } = useAuth();
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
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Effect for redirection on successful registration
  useEffect(() => {
    if (registrationSuccess && userId && userRole) {
      console.log('Registration successful, redirecting to dashboard for role:', userRole);

      // Immediate redirect based on role
      if (userRole === 'business') {
        navigate(ROUTES.BUSINESS_DASHBOARD);
      } else if (userRole === 'admin') {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    }
  }, [registrationSuccess, userId, userRole, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Sign up the user in Supabase Auth
      const { data: authData, error: signUpError } = await supabaseService.signUp(
        formData.email,
        formData.password
      );

      if (signUpError) {
        // Handle the specific case of already registered user
        if (signUpError.message.includes('User already registered')) {
          setLocalError('Este correo electrónico ya está registrado. Por favor usa otro o inicia sesión.');
          setIsLoading(false);
          return;
        }
        throw signUpError;
      }

      if (authData?.user) {
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

        // Store user ID and role for redirection
        setUserId(authData.user.id);
        setUserRole(formData.role);

        // Mark registration as successful to trigger redirection
        setRegistrationSuccess(true);
      } else {
        // If no user was created in the auth step
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

  // If registration was successful, show a loading state until redirection
  if (registrationSuccess) {
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
            <p className="text-gray-600">Redirigiendo al dashboard...</p>
            <button
              onClick={() => {
                if (userRole === 'business') {
                  navigate(ROUTES.BUSINESS_DASHBOARD);
                } else if (userRole === 'admin') {
                  navigate(ROUTES.ADMIN_DASHBOARD);
                } else {
                  navigate(ROUTES.DASHBOARD);
                }
              }}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
            >
              Ir al dashboard ahora
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Crear cuenta
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(authError || localError) && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {authError instanceof Error ? authError.message : authError || localError}
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
                disabled={isLoading || authLoading}
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
                disabled={isLoading || authLoading}
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
                  disabled={isLoading || authLoading}
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
                  disabled={isLoading || authLoading}
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
                disabled={isLoading || authLoading}
              >
                <option value="business">Negocio</option>
                <option value="client">Cliente</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || authLoading}
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
