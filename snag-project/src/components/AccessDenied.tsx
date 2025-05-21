import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { ROUTES } from '../lib/constants/routes';

const AccessDenied: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
<p className="text-gray-600 mb-6">
  No tienes permisos suficientes para acceder a esta página. Contacta con un administrador si crees que deberías tener acceso.
</p>
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default AccessDenied;
