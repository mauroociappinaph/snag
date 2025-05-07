import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/hooks/useAuthStore';
import { ROUTES } from '../lib/constants/routes';

const LoginPage: React.FC = () => {
  console.log('AUTH DEBUG - LoginPage rendering');
  const { signIn, loading, error, isAuthenticated, user } = useAuth();

  console.log('AUTH DEBUG - LoginPage auth state:', {
    loading,
    error: error ? String(error) : null,
    isAuthenticated,
    userId: user?.id
  });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('AUTH DEBUG - Login form submitted with email:', formData.email);

    setIsLoading(true);
    setLocalError(null);

    try {
      console.log('AUTH DEBUG - Calling signIn method');
      await signIn(formData.email, formData.password);

      console.log('AUTH DEBUG - SignIn completed, checking auth state');
      // Pequeña demora para permitir que se procese la autenticación
      setTimeout(() => {
        console.log('AUTH DEBUG - Checking auth state after delay:', {
          isAuthenticated: isAuthenticated,
          userId: user?.id
        });

        // Usar window.location para una redirección completa
        console.log('AUTH DEBUG - Redirecting to dashboard');
        window.location.href = '/dashboard';
      }, 1000);
    } catch (error) {
      console.error('AUTH DEBUG - Login error:', error);
      setLocalError(error instanceof Error ? error.message : 'Error al iniciar sesión');
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  console.log('AUTH DEBUG - LoginPage rendering with state:', {
    isLoading,
    localError
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Iniciar sesión
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || localError) && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {localError || (error ? String(error) : '')}
              </div>
            )}
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
                disabled={isLoading || loading}
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
                  disabled={isLoading || loading}
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

            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || loading}
            >
              {isLoading || loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

            <p className="text-center text-gray-600 text-sm">
              ¿No tienes una cuenta?{' '}
              <Link to={ROUTES.REGISTER} className="text-blue-500 hover:text-blue-600 font-medium">
                Registrarse
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
