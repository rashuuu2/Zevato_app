import { UserProfile, Address, PaymentMethod } from '@/types/user';

let userProfile: UserProfile = {
  id: '',
  name: 'User',
  email: '',
  phone: 'Add phone number',
  addresses: [],
  paymentMethods: [
    {
      id: 'pay-1',
      type: 'upi',
      title: 'Google Pay (UPI)',
      details: 'Instant Confirmation',
      isDefault: true,
    },
    {
      id: 'pay-2',
      type: 'card',
      title: 'Visa / Mastercard',
      details: '•••• 4242',
      isDefault: false,
    },
  ],
  hasProtectionPlan: true,
  protectionPlanExpiry: '31 Dec 2026',
};

const listeners = new Set<() => void>();

export const userStore = {
  get: () => userProfile,
  updateProfile: (updates: Partial<UserProfile>) => {
    userProfile = { ...userProfile, ...updates };
    listeners.forEach((l) => l());
  },
  addAddress: (address: Address) => {
    userProfile.addresses.push(address);
    listeners.forEach((l) => l());
  },
  addPaymentMethod: (payment: PaymentMethod) => {
    userProfile.paymentMethods.push(payment);
    listeners.forEach((l) => l());
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
