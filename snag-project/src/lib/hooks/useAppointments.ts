import { useState } from 'react';
import { useAuth } from './useAuth';
import { appointmentService } from '../services/appointmentService';
import type { Database } from '../types/database.types';

type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export const useAppointments = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createAppointment = async (appointmentData: Omit<AppointmentInsert, 'client_id' | 'status'>) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      const appointment: AppointmentInsert = {
        ...appointmentData,
        client_id: user.id,
        status: 'pending'
      };

      const result = await appointmentService.create(appointment);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAppointments = async () => {
    if (!user || !profile) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      if (profile.role === 'business') {
        return await appointmentService.getByBusinessId(user.id);
      } else {
        return await appointmentService.getByClientId(user.id);
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: AppointmentStatus) => {
    if (!user || !profile) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      const result = await appointmentService.updateStatus(
        appointmentId,
        status,
        user.id,
        profile.role
      );
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (appointmentId: string) => {
    if (!user || !profile) throw new Error('User must be authenticated');

    try {
      setLoading(true);
      setError(null);

      await appointmentService.delete(appointmentId, user.id, profile.role);
      return true;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async (
    businessId: string,
    serviceId: string,
    date: string,
    startTime: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      const isAvailable = await appointmentService.checkAvailability(
        businessId,
        serviceId,
        date,
        startTime
      );
      return isAvailable;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createAppointment,
    getAppointments,
    updateAppointmentStatus,
    deleteAppointment,
    checkAvailability,
    loading,
    error
  };
};
