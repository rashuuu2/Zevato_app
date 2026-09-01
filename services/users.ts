import { api } from './api';
import { userStore } from '@/store/userStore';
import { UserProfile, Address, PaymentMethod } from '@/types/user';

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    try {
      const data = await api.get<UserProfile>('/me');
      if (data) {
        userStore.updateProfile(data);
        return data;
      }
    } catch (e) {
      console.warn('userService.getProfile falling back to local user store');
    }
    return userStore.get();
  },

  updateProfile: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const data = await api.patch<UserProfile>('/me', updates);
      if (data) {
        userStore.updateProfile(data);
        return data;
      }
    } catch (e) {
      console.warn('userService.updateProfile falling back to local user store');
    }
    userStore.updateProfile(updates);
    return userStore.get();
  },

  getAddresses: async (): Promise<Address[]> => {
    try {
      const data = await api.get<Address[]>('/addresses');
      if (Array.isArray(data)) {
        return data;
      }
    } catch (e) {
      console.warn('userService.getAddresses falling back to userStore addresses');
    }
    return userStore.get().addresses;
  },

  addAddress: async (address: Partial<Address>): Promise<Address[]> => {
    try {
      const newAddress = await api.post<Address>('/addresses', address);
      if (newAddress) {
        userStore.addAddress(newAddress);
        return userStore.get().addresses;
      }
    } catch (e) {
      console.warn('userService.addAddress falling back to local userStore');
    }
    const fallback: Address = {
      id: address.id || `addr-${Date.now()}`,
      title: address.title || 'Home',
      street: address.street || '',
      city: address.city || 'Bengaluru',
      state: address.state || 'Karnataka',
      zipCode: address.zipCode || '560102',
      country: address.country || 'India',
      isDefault: address.isDefault || false,
      type: address.type || 'home',
    };
    userStore.addAddress(fallback);
    return userStore.get().addresses;
  },

  deleteAddress: async (id: string): Promise<void> => {
    try {
      await api.delete(`/addresses/${id}`);
    } catch (e) {
      console.warn('userService.deleteAddress fallback:', e);
    }
  },

  addPaymentMethod: async (payment: PaymentMethod): Promise<PaymentMethod[]> => {
    userStore.addPaymentMethod(payment);
    return userStore.get().paymentMethods;
  },
};

export default userService;
