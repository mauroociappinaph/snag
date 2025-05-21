import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import { useAuth } from '../lib/hooks/useAuth';
import { supabase } from '../lib/supabase/supabaseClient';
import { ROUTES } from '../lib/constants/routes';
import type { Database } from '../lib/types/database.types';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { getStatusColor } from '../lib/constants/statusColors';

type ReservationWithDetails = Database['public']['Tables']['reservations']['Row'] & {
  user: Database['public']['Tables']['profiles']['Row'];
};

const AppointmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [reservation, setReservation] = useState<ReservationWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        if (!id || !user || !profile) return;

        const { data, error } = await supabase
          .from('reservations')
          .select(`
            *,
            user:profiles(*)
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Reservation not found');

        // Verificar permisos
        const hasAccess =
          profile.role === 'Admin' ||
          data.user_id === user.id;

        if (!hasAccess) {
          throw new Error('You do not have permission to view this reservation');
        }

        setReservation(data as ReservationWithDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        // Allow user to see the error before redirecting
        setTimeout(() => {
          navigate(ROUTES.DASHBOARD);
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [id, user, profile, navigate]);

if (loading) {
   return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
   );
 }

  if (error || !reservation) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error || 'Reservation not found'}
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Detalles de la Reserva</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
            </span>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <Calendar className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Fecha</p>
                <p className="text-gray-900">{formatDate(reservation.date)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Clock className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Horario</p>
                <p className="text-gray-900">{formatTime(reservation.time)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Tag className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Servicio</p>
                <p className="text-gray-900">{reservation.service}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <User className="w-6 h-6 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Usuario</p>
                <p className="text-gray-900">{reservation.user.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailPage;
