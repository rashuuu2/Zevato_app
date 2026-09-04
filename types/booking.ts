import { Address, PaymentMethod } from './user';
import { ServiceOption } from './service';

export type BookingStatus =
  | 'scheduled'
  | 'technician_assigned'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface Technician {
  id: string;
  name: string;
  phone: string;
  rating: number;
  completedJobs: number;
  avatarUrl?: string;
  latitude?: number;
  longitude?: number;
}

export interface BookingStep {
  id: string;
  title: string;
  completed: boolean;
  timestamp?: string;
}

export interface InvoiceItem {
  description: string;
  amount: number;
}

export interface Invoice {
  id: string;
  bookingId: string;
  date: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  items: InvoiceItem[];
  pdfUrl?: string;
}

export interface Booking {
  id: string;
  bookingNumber?: string;
  serviceId: string;
  serviceTitle: string;
  selectedOption: ServiceOption;
  categoryId?: string;
  categoryName: string;
  brandId?: string;
  brandName?: string;
  productId?: string;
  productVariantId?: string;
  productName?: string;
  status: BookingStatus;
  paymentStatus?: 'payment_pending' | 'payment_processing' | 'payment_paid' | 'payment_failed' | 'payment_cancelled' | string;
  simulatedTransactionId?: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  address: Address;
  paymentMethod: PaymentMethod;
  subtotal?: number;
  discount?: number;
  tax?: number;
  totalAmount: number;
  technician?: Technician;
  steps?: BookingStep[];
  invoice?: Invoice;
  createdAt: string;
}
