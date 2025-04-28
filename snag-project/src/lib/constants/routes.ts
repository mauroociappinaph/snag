export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  APPOINTMENTS: '/appointments',
  BUSINESSES: '/businesses',
  PROFILE: '/profile',
  SETTINGS: '/settings'
} as const;

export type Route = typeof ROUTES[keyof typeof ROUTES];
