import React from 'react';
import { useAuth } from '../lib/hooks/useAuth';

const BusinessDashboardPage: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Panel de Control - Negocio
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Resumen de Citas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Citas</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Hoy</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Esta semana</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
          </div>
        </div>

        {/* Servicios */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Servicios</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Total de servicios</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-medium transition-colors">
              Añadir servicio
            </button>
          </div>
        </div>

        {/* Perfil del Negocio */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mi Negocio</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Nombre</p>
              <p className="text-gray-900">Nombre del negocio</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-gray-900">{profile?.email}</p>
            </div>
            <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-md font-medium transition-colors">
              Editar perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboardPage;
