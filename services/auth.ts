import { api } from './api';
import { UserProfile } from '@/types/user';

export const authService = {
  login: async (email: string): Promise<{ token: string; user: UserProfile }> => {
    return api.post({
      token: 'mock-jwt-token-zevota',
      user: {
        id: 'user-001',
        name: 'Alex Johnson',
        email,
        phone: '+91 98765 12345',
        addresses: [],
        paymentMethods: [],
      },
    });
  },
  signup: async (name: string, email: string, phone: string): Promise<{ token: string; user: UserProfile }> => {
    return api.post({
      token: 'mock-jwt-token-zevota',
      user: {
        id: `user-${Date.now()}`,
        name,
        email,
        phone,
        addresses: [],
        paymentMethods: [],
      },
    });
  },
  resetPassword: async (email: string): Promise<{ success: boolean }> => {
    return api.post({ success: true });
  },
};
