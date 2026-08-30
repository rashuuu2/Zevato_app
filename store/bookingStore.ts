import { ServiceCategory, ServiceOption } from '@/types/service';
import { Address, PaymentMethod } from '@/types/user';

export interface BookingDraft {
  category?: ServiceCategory;
  categoryName?: string;
  brandName?: string;
  productName?: string;
  serviceId?: string;
  serviceTitle?: string;
  selectedOption?: ServiceOption;
  scheduledDate?: string;
  scheduledTimeSlot?: string;
  address?: Address;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

let draft: BookingDraft = {};

const listeners = new Set<() => void>();

export const bookingStore = {
  get: () => draft,
  set: (newDraft: Partial<BookingDraft>) => {
    draft = { ...draft, ...newDraft };
    listeners.forEach((l) => l());
  },
  reset: () => {
    draft = {};
    listeners.forEach((l) => l());
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
