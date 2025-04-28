import React, { useState } from 'react';
import { Menu, X, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HeaderProps } from './interfaces/Header.interface';
import { useScroll } from '../lib/hooks/useScroll';
import { ROUTES } from '../lib/constants/routes';

const Header: React.FC<HeaderProps> = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isScrolled } = useScroll();

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to={ROUTES.HOME} className="flex items-center">
          <Calendar className="h-8 w-8 text-blue-500" />
          <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">Snag</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to={ROUTES.HOME} className="text-gray-800 hover:text-blue-500 transition-colors font-medium">Inicio</Link>
          <a href="#features" className="text-gray-800 hover:text-blue-500 transition-colors font-medium">Características</a>
          <a href="#contact" className="text-gray-800 hover:text-blue-500 transition-colors font-medium">Contacto</a>
          <Link to={ROUTES.LOGIN} className="text-gray-800 hover:text-blue-500 transition-colors font-medium">Registrarse</Link>
          <Link
            to={ROUTES.REGISTER}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-md font-medium transition-colors"
          >
            Sign Up
          </Link>
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
