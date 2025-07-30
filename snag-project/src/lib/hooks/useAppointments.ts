import { useState, useEffect, useCallback } from 'react';
import { appointmentService } from '../services/appointmentService';
import type { Appointment } from '../types/reservation.types';

/**
 * Custom hook to fetch and manage appointments for a specific business.
 * @param businessId The UUID of the business whose appointments are to be fetched.
 * @returns An object containing the list of appointments, a loading state, and an error state.
 */
export const useAppointments = (businessId: string | null) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAppointments = useCallback(async () => {
    if (!businessId) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await appointmentService.getByBusinessId(businessId);
      // Assuming the service returns data that matches the Appointment[] type
      setAppointments(data as any[] as Appointment[]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments, // Expose a refetch function
  };
};