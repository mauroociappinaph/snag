import React from 'react';
import { useAuth } from '../lib/hooks/useAuth';

const ProfilePage: React.FC = () => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          No se pudo cargar el perfil
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Información Personal</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Nombre completo</label>
                <p className="mt-1 text-gray-900">{profile.name || 'No especificado'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <p className="mt-1 text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Rol</label>
                <p className="mt-1 text-gray-900 capitalize">{profile.role || 'No especificado'}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Cuenta</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">ID de usuario</label>
                <p className="mt-1 text-gray-900">{user.id}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Fecha de registro</label>
                <p className="mt-1 text-gray-900">
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString()
                    : 'No disponible'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
