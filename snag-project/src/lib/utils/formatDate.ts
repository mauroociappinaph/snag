interface DateFormatOptions {
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
}

export const formatDate = (
  date: Date | string,
  { locale = 'es-ES', options = {} }: DateFormatOptions = {}
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };

  return dateObj.toLocaleDateString(locale, defaultOptions);
};
