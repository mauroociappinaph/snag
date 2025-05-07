import React, { useState } from 'react';
import { Menu, X, UserCircle, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { HeaderProps } from './interfaces/Header.interface';
import { useScroll } from '../lib/hooks/useScroll';
import { ROUTES } from '../lib/constants/routes';
import { useAuth } from '../lib/hooks/useAuthStore';

const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { isScrolled } = useScroll();
  const { user, profile, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  console.log('AUTH DEBUG - Header rendering with auth state:', {
    isAuthenticated,
    hasUser: !!user,
    userId: user?.id,
    hasProfile: !!profile,
    role: profile?.role
  });

  const handleSignOut = async () => {
    console.log('AUTH DEBUG - Header: handleSignOut called');
    try {
      await signOut();
      console.log('AUTH DEBUG - Header: signOut successful');
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('AUTH DEBUG - Header: Error signing out:', error);
    }
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to={ROUTES.HOME} className="flex items-center space-x-2">
          <div className="text-blue-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-8 h-8"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
          <span className="text-xl font-bold text-blue-500">Snag</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to={ROUTES.HOME} className="text-gray-800 hover:text-blue-500 transition-colors">Inicio</Link>
          <a href="#features" className="text-gray-800 hover:text-blue-500 transition-colors">Características</a>
          <a href="#contact" className="text-gray-800 hover:text-blue-500 transition-colors">Contacto</a>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => {
                  console.log('AUTH DEBUG - Header: Profile button clicked, current state:', {
                    isAuthenticated,
                    hasUser: !!user,
                    hasProfile: !!profile
                  });
                  setIsProfileMenuOpen(!isProfileMenuOpen);
                }}
                className="flex items-center space-x-2 text-gray-800 hover:text-blue-500 transition-colors"
              >
                <span className="font-medium">
                  {profile?.name || user?.email?.split('@')[0] || 'Mi Perfil'}
                </span>
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  <UserCircle className="h-6 w-6" />
                </div>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link
                    to={ROUTES.PROFILE}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      console.log('AUTH DEBUG - Header: Profile link clicked');
                      setIsProfileMenuOpen(false);
                    }}
                  >
                    Mi Perfil
                  </Link>
                  <Link
                    to={ROUTES.DASHBOARD}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      console.log('AUTH DEBUG - Header: Dashboard link clicked');
                      setIsProfileMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      console.log('AUTH DEBUG - Header: Sign out button clicked');
                      setIsProfileMenuOpen(false);
                      handleSignOut();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to={ROUTES.LOGIN}
                className="text-gray-800 hover:text-blue-500 transition-colors font-medium"
                onClick={() => console.log('AUTH DEBUG - Header: Login link clicked')}
              >
                Iniciar sesión
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium transition-colors"
                onClick={() => console.log('AUTH DEBUG - Header: Register link clicked')}
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg">
          <div className="flex flex-col px-4 py-6 space-y-4">
            <Link
              to={ROUTES.HOME}
              className="text-gray-800 hover:text-blue-500 transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <a
              href="#features"
              className="text-gray-800 hover:text-blue-500 transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Características
            </a>
            <a
              href="#contact"
              className="text-gray-800 hover:text-blue-500 transition-colors font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </a>

            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.PROFILE}
                  className="flex items-center space-x-2 text-gray-800 hover:text-blue-500 transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserCircle size={20} />
                  <span>Mi Perfil</span>
                </Link>
                <Link
                  to={ROUTES.DASHBOARD}
                  className="text-gray-800 hover:text-blue-500 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors py-2 font-medium"
                >
                  <LogOut size={20} />
                  <span>Cerrar Sesión</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="text-gray-800 hover:text-blue-500 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium transition-colors w-full text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
