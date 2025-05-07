import { Toaster } from 'react-hot-toast';

export const Notifications = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 5000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          icon: '🔔',
          style: {
            background: '#4aed88',
            color: '#fff',
          },
        },
        error: {
          duration: 4000,
          icon: '🔔',
          style: {
            background: '#ff4b4b',
            color: '#fff',
          },
        },
      }}
    />
  );
};
