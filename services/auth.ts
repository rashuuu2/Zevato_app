import { api } from './api';

export const authService = {
  formatAuthError: (error: any): string => {
    if (!error) return 'An unexpected authentication error occurred.';
    if (typeof error === 'string') return error;
    if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
      return error.errors[0].longMessage || error.errors[0].message || 'Authentication error';
    }
    return error.message || 'Authentication operation failed.';
  },
  validateEmail: (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  },
};

export default authService;
