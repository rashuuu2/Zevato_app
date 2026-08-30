import { api } from './api';
import { userStore } from '@/store/userStore';
import { UserProfile, Address, PaymentMethod } from '@/types/user';

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    return api.get(userStore.get());
  },
  updateProfile: async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    userStore.updateProfile(updates);
    return api.post(userStore.get());
  },
  addAddress: async (address: Address): Promise<Address[]> => {
    userStore.addAddress(address);
    return api.post(userStore.get().addresses);
  },
  addPaymentMethod: async (payment: PaymentMethod): Promise<PaymentMethod[]> => {
    userStore.addPaymentMethod(payment);
    return api.post(userStore.get().paymentMethods);
  },
};
