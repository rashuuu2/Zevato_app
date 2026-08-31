import { UserProfile } from '@/types/user';

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
}

let syncState: AuthState = {
  isAuthenticated: false,
  user: null,
};

const listeners = new Set<() => void>();

export const authStore = {
  get: () => syncState,
  syncFromClerk: (isSignedIn: boolean, user: UserProfile | null) => {
    syncState = { isAuthenticated: isSignedIn, user };
    listeners.forEach((l) => l());
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
