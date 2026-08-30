import { useState, useEffect } from 'react';
import { authStore, AuthState } from '@/store/authStore';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>(authStore.get());

  useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setState(authStore.get());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return {
    ...state,
    setAuth: authStore.set,
  };
};

export default useAuth;
