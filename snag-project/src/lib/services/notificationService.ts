import { supabaseService } from '../supabase/supabaseClient';
import type { Reservation } from '../types/reservation.types';

class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async sendAppointmentConfirmation(reservation: Reservation) {
    try {
      // Obtener información del usuario y el negocio
      const [userProfile, businessProfile] = await Promise.all([
        supabaseService.getUserProfile(reservation.user_id),
        supabaseService.getUserProfile(reservation.business_id)
      ]);

      if (!userProfile.data || !businessProfile.data) {
        throw new Error('No se pudo obtener la información necesaria');
      }

      // Aquí iría la lógica para enviar la notificación
      // Por ahora, solo lo registramos en la consola
      console.log('Notificación de confirmación enviada:', {
        to: userProfile.data.email,
        subject: 'Confirmación de cita',
        details: {
          service: reservation.service,
          date: reservation.date,
          time: reservation.time,
          business: businessProfile.data.name
        }
      });

      return true;
    } catch (error) {
      console.error('Error al enviar notificación de confirmación:', error);
      return false;
    }
  }

  public async sendAppointmentReminder(reservation: Reservation) {
    try {
      const userProfile = await supabaseService.getUserProfile(reservation.user_id);

      if (!userProfile.data) {
        throw new Error('No se pudo obtener la información del usuario');
      }

      // Aquí iría la lógica para enviar el recordatorio
      console.log('Recordatorio de cita enviado:', {
        to: userProfile.data.email,
        subject: 'Recordatorio de cita',
        details: {
          service: reservation.service,
          date: reservation.date,
          time: reservation.time
        }
      });

      return true;
    } catch (error) {
      console.error('Error al enviar recordatorio:', error);
      return false;
    }
  }

  public async sendAppointmentCancellation(reservation: Reservation) {
    try {
      const [userProfile, businessProfile] = await Promise.all([
        supabaseService.getUserProfile(reservation.user_id),
        supabaseService.getUserProfile(reservation.business_id)
      ]);

      if (!userProfile.data || !businessProfile.data) {
        throw new Error('No se pudo obtener la información necesaria');
      }

      // Aquí iría la lógica para enviar la notificación de cancelación
      console.log('Notificación de cancelación enviada:', {
        to: userProfile.data.email,
        subject: 'Cancelación de cita',
        details: {
          service: reservation.service,
          date: reservation.date,
          time: reservation.time,
          business: businessProfile.data.name
        }
      });

      return true;
    } catch (error) {
      console.error('Error al enviar notificación de cancelación:', error);
      return false;
    }
  }
}

export const notificationService = NotificationService.getInstance();
