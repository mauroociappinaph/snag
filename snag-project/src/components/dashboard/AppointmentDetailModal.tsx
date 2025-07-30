import React, { useState, useEffect } from "react";
import type {
  Appointment,
  AppointmentStatus,
} from "../../lib/types/reservation.types";
import { appointmentService } from "../../lib/services/appointmentService";
import { useAuth } from "../../lib/hooks/useAuth";
import { toast } from "react-hot-toast";
import { LoadingSpinner } from "../ui/LoadingSpinner";

interface AppointmentDetailModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onUpdateSuccess: () => void; // Callback to refetch appointments after update
  userRole: string; // Add userRole prop
}

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({
  appointment,
  onClose,
  onUpdateSuccess,
  userRole, // Add userRole to destructuring
}) => {
  const { user } = useAuth(); // Removed 'role' from here
  const [newStatus, setNewStatus] = useState<AppointmentStatus | "">("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      setNewStatus(appointment.status);
    }
  }, [appointment]);

  if (!appointment) return null; // Don't render if no appointment is provided

  const handleStatusChange = async () => {
    if (!user || !userRole || !newStatus || newStatus === appointment.status)
      return;

    setLoading(true);
    try {
      await appointmentService.updateStatus(
        appointment.id,
        newStatus,
        user.id,
        userRole
      );
      toast.success("Estado de la cita actualizado con éxito!");
      onUpdateSuccess(); // Trigger refetch in parent component
      onClose();
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Error al actualizar el estado de la cita.");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions: AppointmentStatus[] = [
    "pending",
    "confirmed",
    "cancelled",
    "completed",
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
      <div className="relative p-8 bg-white w-full max-w-md mx-auto rounded-lg shadow-lg">
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <LoadingSpinner />
          </div>
        )}
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Detalles de la Cita
        </h3>
        <div className="space-y-3 text-gray-700">
          <p>
            <strong>Cliente:</strong> {appointment.client?.full_name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {appointment.client?.email || "N/A"}
          </p>
          <p>
            <strong>Servicio:</strong> {appointment.service}
          </p>
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(appointment.date).toLocaleDateString()}
          </p>
          <p>
            <strong>Hora:</strong> {appointment.time}
          </p>
          <p>
            <strong>Estado Actual:</strong>{" "}
            <span className="font-semibold capitalize">
              {appointment.status}
            </span>
          </p>
        </div>

        <div className="mt-6">
          <label
            htmlFor="status-select"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Cambiar Estado:
          </label>
          <select
            id="status-select"
            name="status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as AppointmentStatus)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status}
              </option>
            ))}
          </select>
          <button
            onClick={handleStatusChange}
            disabled={loading || newStatus === appointment.status}
            className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Actualizando..." : "Guardar Cambios"}
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;
