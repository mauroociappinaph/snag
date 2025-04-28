import React from 'react';
import { useAuth } from '../lib/hooks/useAuth';

const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Bienvenido, {profile?.full_name || user?.email}
      </h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Tu perfil</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Nombre</p>
            <p className="font-medium">{profile?.full_name || 'No especificado'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Rol</p>
            <p className="font-medium capitalize">{profile?.role || 'No especificado'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
