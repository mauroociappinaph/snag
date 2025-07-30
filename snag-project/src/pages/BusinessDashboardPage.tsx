import React, { useState } from 'react';
import { useAuth } from '../lib/hooks/useAuth';
import { useAppointments } from '../lib/hooks/useAppointments';
import AppointmentList from '../components/dashboard/AppointmentList';
import AppointmentDetailModal from '../components/dashboard/AppointmentDetailModal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import Layout from '../components/Layout';

const BusinessDashboardPage: React.FC = () => {
  const { profile, user } = useAuth();
  const businessId = profile?.business_id || null; // Assuming business_id is on the profile

  const { appointments, loading, error, refetch } = useAppointments(businessId);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleSelectAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-500 py-10">
          <p>Error al cargar las citas: {error.message}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Panel de Control - Negocio
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Resumen de Citas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Citas</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Total de citas</p>
                <p className="text-2xl font-bold text-blue-600">{appointments.length}</p>
              </div>
              {/* Puedes añadir más métricas aquí, como citas de hoy, esta semana, etc. */}
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
                <p className="text-gray-900">{profile?.full_name || 'Nombre del negocio'}</p>
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

        <h2 className="text-xl font-bold text-gray-900 mb-4">Próximas Citas</h2>
        <AppointmentList
          appointments={appointments}
          onSelectAppointment={handleSelectAppointment}
        />

        {selectedAppointment && (
          <AppointmentDetailModal
            appointment={selectedAppointment}
            onClose={handleCloseModal}
            onUpdateSuccess={refetch}
            userRole={profile?.role || ''}
          />
        )}
      </div>
    </Layout>
  );
};

export default BusinessDashboardPage;
