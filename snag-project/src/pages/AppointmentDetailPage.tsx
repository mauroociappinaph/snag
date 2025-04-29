import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Building2, User, Tag } from 'lucide-react';
import { useAuth } from '../lib/hooks/useAuth';
import { supabase } from '../lib/supabase/supabaseClient';
import { ROUTES } from '../lib/constants/routes';
import type { Database } from '../lib/types/database.types';

type AppointmentWithDetails = Database['public']['Tables']['appointments']['Row'] & {
  business: Database['public']['Tables']['businesses']['Row'];
  service: Database['public']['Tables']['services']['Row'];
  client: Database['public']['Tables']['profiles']['Row'];
};

const AppointmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [appointment, setAppointment] = useState<AppointmentWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        if (!id || !user || !profile) return;

        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            business:businesses(*),
            service:services(*),
            client:profiles!appointments_client_id_fkey(*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Appointment not found');

        // Verificar permisos
        const hasAccess =
          profile.role === 'admin' ||
          data.client_id === user.id ||
          data.business_id === user.id;

        if (!hasAccess) {
          throw new Error('You do not have permission to view this appointment');
        }

        setAppointment(data as AppointmentWithDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        navigate(ROUTES.DASHBOARD);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id, user, profile, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error || 'Appointment not found'}
        </div>
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Detalles de la Cita</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </span>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Calendar className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="text-gray-900">{formatDate(appointment.date)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Clock className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Horario</p>
                <p className="text-gray-900">
                  {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Building2 className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Negocio</p>
                <p className="text-gray-900">{appointment.business.name}</p>
                <p className="text-sm text-gray-500">{appointment.business.address}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <User className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Cliente</p>
                <p className="text-gray-900">{appointment.client.full_name}</p>
                <p className="text-sm text-gray-500">{appointment.client.email}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Tag className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Servicio</p>
                <p className="text-gray-900">{appointment.service.name}</p>
                <p className="text-sm text-gray-500">
                  Duración: {appointment.service.duration} minutos
                </p>
                <p className="text-sm text-gray-500">
                  Precio: ${appointment.service.price}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailPage;
