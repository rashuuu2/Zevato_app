import { UserProfile } from '@/types/user';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
}

let authState: AuthState = {
  isAuthenticated: true,
  user: {
    id: 'user-001',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+91 98765 12345',
    addresses: [
      {
        id: 'addr-1',
        title: 'Home',
        street: 'Flat 402, Green Valley Apartments, HSR Layout',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560102',
        isDefault: true,
      },
    ],
    paymentMethods: [
      {
        id: 'pay-1',
        type: 'upi',
        title: 'Google Pay',
        details: 'alex@okaxis',
        isDefault: true,
      },
    ],
    hasProtectionPlan: true,
    protectionPlanExpiry: '31 Dec 2026',
  },
  token: 'mock-jwt-token-zevota',
};

const listeners = new Set<() => void>();

export const authStore = {
  get: () => authState,
  set: (newState: Partial<AuthState>) => {
    authState = { ...authState, ...newState };
    listeners.forEach((l) => l());
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
