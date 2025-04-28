import React from 'react';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Panel de Administración
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Estadísticas de Usuarios */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Usuarios</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Total de usuarios</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Negocios registrados</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Clientes registrados</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
          </div>
        </div>

        {/* Estadísticas de Citas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Citas</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Total de citas</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Citas hoy</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Citas esta semana</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-medium transition-colors">
              Gestionar Usuarios
            </button>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-medium transition-colors">
              Gestionar Negocios
            </button>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md font-medium transition-colors">
              Ver Reportes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
