export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  BUSINESS_DASHBOARD: '/business/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
  APPOINTMENTS: '/appointments',
  BUSINESSES: '/businesses',
  PROFILE: '/profile',
  APPOINTMENT_DETAIL: '/appointments/:id',
  BUSINESS_PROFILE: '/business/profile',
  SETTINGS: '/settings'
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
