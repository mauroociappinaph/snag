import React from 'react';
import type { Appointment } from '../../lib/types/reservation.types';
import AppointmentListItem from './AppointmentListItem';

interface AppointmentListProps {
  appointments: Appointment[];
  onSelectAppointment: (appointment: Appointment) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, onSelectAppointment }) => {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No se encontraron citas.</p>
        <p className="text-sm text-gray-400">Parece que no tienes ninguna cita programada por el momento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentListItem
          key={appointment.id}
          appointment={appointment}
          onSelect={onSelectAppointment}
        />
      ))}
    </div>
  );
};

export default AppointmentList;
