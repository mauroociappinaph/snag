import React from 'react';
import type { Appointment, AppointmentStatus } from '../../lib/types/reservation.types';

interface AppointmentListItemProps {
  appointment: Appointment;
  onSelect: (appointment: Appointment) => void;
}

const statusColors: { [key in AppointmentStatus]: string } = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-red-100 text-red-800',
  completed: 'bg-green-100 text-green-800',
};

const AppointmentListItem: React.FC<AppointmentListItemProps> = ({ appointment, onSelect }) => {
  const { client, service, date, time, status } = appointment;

  return (
    <div
      onClick={() => onSelect(appointment)}
      className="p-4 mb-4 bg-white border rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 transition-colors duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-800">{client?.full_name || 'Cliente no disponible'}</p>
          <p className="text-sm text-gray-600">{service}</p>
        </div>
        <div className="text-right">
          <p className="text-md font-medium text-gray-900">{new Date(date).toLocaleDateString()}</p>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
        <div className="ml-4">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentListItem;
