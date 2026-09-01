import { ServiceCategory, ServiceOption } from '@/types/service';
import { Address, PaymentMethod } from '@/types/user';

export interface BookingDraft {
  // Step 1: Category
  category?: ServiceCategory;
  categoryId?: string;
  categoryName?: string;

  // Step 2: Brand
  brandId?: string;
  brandName?: string;

  // Step 3: Model
  modelNumber?: string;
  productName?: string;

  // Step 4: Issue / Problem
  selectedIssue?: string;
  issueDescription?: string;
  issuePhotos?: string[];

  // Step 5: Schedule & Address
  scheduledDate?: string;
  scheduledTimeSlot?: string;
  address?: Address;
  specialInstructions?: string;

  // Step 6: Payment & Confirm
  serviceId?: string;
  serviceTitle?: string;
  selectedOption?: ServiceOption;
  paymentMethod?: PaymentMethod;
  notes?: string;
}

let draft: BookingDraft = {};

const listeners = new Set<() => void>();

export const bookingStore = {
  get: (): BookingDraft => draft,
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

export default bookingStore;
