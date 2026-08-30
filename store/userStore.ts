import { UserProfile, Address, PaymentMethod } from '@/types/user';

let userProfile: UserProfile = {
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
      type: 'home',
    },
    {
      id: 'addr-2',
      title: 'Work',
      street: 'Tower B, Tech Park, Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560103',
      isDefault: false,
      type: 'work',
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
    {
      id: 'pay-2',
      type: 'card',
      title: 'HDFC Bank Visa Card',
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
