import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../lib/constants/routes';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Página no encontrada</p>
        <Link
          to={ROUTES.HOME}
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
