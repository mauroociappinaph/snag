import { toast } from 'react-hot-toast';

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: unknown) => {
  console.error('Error:', error);

  if (error instanceof AppError) {
    toast.error(error.message);
    return;
  }

  if (error instanceof Error) {
    toast.error(error.message);
    return;
  }

  toast.error('Ha ocurrido un error inesperado');
};

export const createError = (message: string, code: string, status?: number) => {
  return new AppError(message, code, status);
};
