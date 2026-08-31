export interface ZevotaAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface ZevotaUserMetadata {
  profileCompleted?: boolean;
  phone?: string;
  address?: ZevotaAddress;
}

export interface Address {
  id: string;
  title: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  isDefault?: boolean;
  type?: 'home' | 'work' | 'other';
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet' | 'cash';
  title: string;
  details: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  address?: ZevotaAddress;
  profileCompleted?: boolean;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  hasProtectionPlan?: boolean;
  protectionPlanExpiry?: string;
}

