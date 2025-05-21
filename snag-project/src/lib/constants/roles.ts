/**
 * Enumeration of available user roles for access control.
 */
/**
 * Enumeration of available user roles for access control.
 */
export enum UserRole {
  Admin = 'Admin',
  Business = 'Business',
  User = 'User',
}

// También exportamos un array con todos los roles para facilitar su uso
export const ALL_ROLES = Object.values(UserRole);
