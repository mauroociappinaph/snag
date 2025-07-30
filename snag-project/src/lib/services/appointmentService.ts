import { supabase } from '../supabase/supabaseClient';
import type { Database } from '../types/database.types';
import type { AppointmentStatus } from '../types/reservation.types';

type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];

/**
 * Service object for handling appointment-related database operations.
 */
export const appointmentService = {
  /**
   * Creates a new appointment.
   * @param appointment - The appointment data to insert.
   * @returns The created appointment data.
   */
  async create(appointment: AppointmentInsert) {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Fetches all appointments for a specific client, joining business and service details.
   * @param clientId - The UUID of the client.
   * @returns A list of appointments.
   */
  async getByClientId(clientId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        business:businesses(id, name, email, phone),
        service:services(id, name, duration, price)
      `)
      .eq('client_id', clientId)
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Fetches all appointments for a specific business, joining client and service details.
   * This is the primary function for the business dashboard.
   * @param businessId - The UUID of the business.
   * @returns A list of appointments with nested client and service info.
   */
  async getByBusinessId(businessId: string) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        client:profiles!appointments_client_id_fkey(id, full_name, email),
        service:services(id, name, duration, price)
      `)
      .eq('business_id', businessId)
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  },

  /**
   * Updates the status of a specific appointment after verifying authorization.
   * @param appointmentId - The UUID of the appointment to update.
   * @param status - The new status to set.
   * @param userId - The UUID of the user performing the action.
   * @param userRole - The role of the user performing the action.
   * @returns The updated appointment data.
   */
  async updateStatus(
    appointmentId: string,
    status: AppointmentStatus,
    userId: string,
    userRole: string
  ) {
    // First, verify that the user is authorized to update this appointment.
    // We only fetch the IDs needed for the check for efficiency.
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('client_id, business_id')
      .eq('id', appointmentId)
      .single();

    if (fetchError || !appointment) {
      throw new Error('Appointment not found or failed to fetch for auth check.');
    }

    // Only the client, the business owner of the appointment, or an admin can modify.
    const canModify =
      userRole === 'admin' ||
      (userRole === 'client' && appointment.client_id === userId) ||
      (userRole === 'business' && appointment.business_id === userId);

    if (!canModify) {
      throw new Error('Unauthorized to modify this appointment');
    }

    // If authorized, proceed with the update.
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deletes a specific appointment after verifying authorization.
   * @param appointmentId - The UUID of the appointment to delete.
   * @param userId - The UUID of the user performing the action.
   * @param userRole - The role of the user performing the action.
   * @returns True if deletion was successful.
   */
  async delete(appointmentId: string, userId: string, userRole: string) {
    // First, verify that the user is authorized to delete this appointment.
    const { data: appointment, error: fetchError } = await supabase
      .from('appointments')
      .select('client_id, business_id')
      .eq('id', appointmentId)
      .single();

    if (fetchError || !appointment) {
      throw new Error('Appointment not found or failed to fetch for auth check.');
    }

    // Only the client, the business owner, or an admin can delete.
    const canDelete =
      userRole === 'admin' ||
      (userRole === 'client' && appointment.client_id === userId) ||
      (userRole === 'business' && appointment.business_id === userId);

    if (!canDelete) {
      throw new Error('Unauthorized to delete this appointment');
    }

    // If authorized, proceed with the deletion.
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);

    if (error) throw error;
    return true;
  },

  /**
   * Checks if a specific time slot is available for a given service at a business.
   * @param businessId - The UUID of the business.
   * @param serviceId - The UUID of the service.
   * @param date - The date of the potential appointment (YYYY-MM-DD).
   * @param startTime - The start time of the potential appointment (HH:MM:SS).
   * @returns True if the slot is available, false otherwise.
   */
  async checkAvailability(
    businessId: string,
    serviceId: string,
    date: string,
    startTime: string
  ) {
    // Get the duration of the service to calculate the end time.
    const { data: service } = await supabase
      .from('services')
      .select('duration')
      .eq('id', serviceId)
      .single();

    if (!service) throw new Error('Service not found');

    // Calculate the end time based on the service duration.
    const startDateTime = new Date(`${date}T${startTime}`);
    const endTime = new Date(startDateTime.getTime() + service.duration * 60000)
      .toTimeString()
      .split(' ')[0];

    // Check for any conflicting appointments that are not cancelled.
    const { data: conflicts, error } = await supabase
      .from('appointments')
      .select('id') // We only need to know if a conflict exists, not the data.
      .eq('business_id', businessId)
      .eq('date', date)
      .not('status', 'eq', 'cancelled')
      .or(`start_time.lte.${endTime},end_time.gte.${startTime}`); // Check for overlaps.

    if (error) throw error;
    return conflicts.length === 0;
  }
};
