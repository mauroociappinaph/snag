import toast from 'react-hot-toast';

export const useNotification = () => {
  const showSuccess = (message: string) => {
    toast.success(message);
  };

  const showError = (message: string) => {
    toast.error(message);
  };

  const showLoading = (message: string) => {
    return toast.loading(message);
  };

  const dismiss = (toastId: string) => {
    toast.dismiss(toastId);
  };

  return {
    showSuccess,
    showError,
    showLoading,
    dismiss,
  };
};
