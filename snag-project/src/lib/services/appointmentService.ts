import { supabase } from '../supabase/supabaseClient';
import type { Database } from '../types/database.types';

type AppointmentInsert = Database['public']['Tables']['appointments']['Insert'];
type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export const appointmentService = {
  // Crear una nueva cita
  async create(appointment: AppointmentInsert) {
    const { data, error } = await supabase
      .from('appointments')
      .insert(appointment)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Obtener citas por ID de cliente
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

  // Obtener citas por ID de negocio
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

  // Actualizar el estado de una cita
  async updateStatus(
    appointmentId: string,
    status: AppointmentStatus,
    userId: string,
    userRole: string
  ) {
    // Primero verificamos que el usuario tenga permiso para actualizar esta cita
    const { data: appointment } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();

    if (!appointment) throw new Error('Appointment not found');

    // Solo el cliente, el negocio dueño de la cita o un admin pueden modificar
    const canModify =
      userRole === 'admin' ||
      (userRole === 'client' && appointment.client_id === userId) ||
      (userRole === 'business' && appointment.business_id === userId);

    if (!canModify) {
      throw new Error('Unauthorized to modify this appointment');
    }

    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', appointmentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Eliminar una cita
  async delete(appointmentId: string, userId: string, userRole: string) {
    // Primero verificamos que el usuario tenga permiso para eliminar esta cita
    const { data: appointment } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();

    if (!appointment) throw new Error('Appointment not found');

    // Solo el cliente, el negocio dueño de la cita o un admin pueden eliminar
    const canDelete =
      userRole === 'admin' ||
      (userRole === 'client' && appointment.client_id === userId) ||
      (userRole === 'business' && appointment.business_id === userId);

    if (!canDelete) {
      throw new Error('Unauthorized to delete this appointment');
    }

    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId);

    if (error) throw error;
    return true;
  },

  // Verificar disponibilidad de horario
  async checkAvailability(
    businessId: string,
    serviceId: string,
    date: string,
    startTime: string
  ) {
    // Obtener la duración del servicio
    const { data: service } = await supabase
      .from('services')
      .select('duration')
      .eq('id', serviceId)
      .single();

    if (!service) throw new Error('Service not found');

    // Calcular la hora de fin basada en la duración del servicio
    const startDateTime = new Date(`${date}T${startTime}`);
    const endTime = new Date(startDateTime.getTime() + service.duration * 60000)
      .toTimeString()
      .split(' ')[0];

    // Verificar si hay citas que se superpongan
    const { data: conflicts, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('business_id', businessId)
      .eq('date', date)
      .not('status', 'eq', 'cancelled')
      .or(`start_time.lte.${endTime},end_time.gte.${startTime}`);

    if (error) throw error;
    return conflicts.length === 0;
  }
};
