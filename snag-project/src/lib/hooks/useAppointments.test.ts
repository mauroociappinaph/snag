import { renderHook, waitFor, act } from '@testing-library/react';
import { useAppointments } from './useAppointments';
import { appointmentService } from '../services/appointmentService';

// Mock the appointmentService
jest.mock('../services/appointmentService', () => ({
  appointmentService: {
    getByBusinessId: jest.fn(),
  },
}));

describe('useAppointments', () => {
  const mockAppointments = [
    {
      id: '1',
      business_id: 'business1',
      client: { full_name: 'John Doe', email: 'john@example.com' },
      service: 'Haircut',
      date: '2025-01-01',
      time: '10:00',
      status: 'confirmed',
    },
    {
      id: '2',
      business_id: 'business1',
      client: { full_name: 'Jane Smith', email: 'jane@example.com' },
      service: 'Manicure',
      date: '2025-01-02',
      time: '11:00',
      status: 'pending',
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch appointments successfully', async () => {
    (appointmentService.getByBusinessId as jest.Mock).mockResolvedValue(mockAppointments);

    const { result } = renderHook(() => useAppointments('business1'));

    expect(result.current.loading).toBe(true);
    expect(result.current.appointments).toEqual([]);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.appointments).toEqual(mockAppointments);
      expect(result.current.error).toBeNull();
    });

    expect(appointmentService.getByBusinessId).toHaveBeenCalledWith('business1');
  });

  it('should handle error when fetching appointments', async () => {
    const mockError = new Error('Failed to fetch appointments');
    (appointmentService.getByBusinessId as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAppointments('business1'));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.appointments).toEqual([]);
      expect(result.current.error).toEqual(mockError);
    });

    expect(appointmentService.getByBusinessId).toHaveBeenCalledWith('business1');
  });

  it('should refetch appointments when refetch is called', async () => {
    (appointmentService.getByBusinessId as jest.Mock)
      .mockResolvedValueOnce([]) // Initial empty state
      .mockResolvedValueOnce(mockAppointments); // Data after refetch

    const { result } = renderHook(() => useAppointments('business1'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.appointments).toEqual([]);

    await act(async () => {
      result.current.refetch();
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.appointments).toEqual(mockAppointments);
    });

    expect(appointmentService.getByBusinessId).toHaveBeenCalledTimes(2);
  });

  it('should not fetch if businessId is null', async () => {
    const { result } = renderHook(() => useAppointments(null));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.appointments).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    expect(appointmentService.getByBusinessId).not.toHaveBeenCalled();
  });
});
