import { api } from './api';
import { bookings as mockBookings } from '@/data/bookings';
import { Booking } from '@/types/booking';

export const bookingService = {
  getAllBookings: async (): Promise<Booking[]> => {
    return api.get(mockBookings);
  },
  getBookingById: async (id: string): Promise<Booking | undefined> => {
    const booking = mockBookings.find((b) => b.id === id) || mockBookings[0];
    return api.get(booking);
  },
  createBooking: async (bookingData: Partial<Booking>): Promise<Booking> => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newBookingId = `ZEV-2026-${randomNum}`;

    const optionPrice = bookingData.selectedOption?.price || 599;
    const tax = Math.round(optionPrice * 0.18);
    const total = optionPrice + tax;

    const newBooking: Booking = {
      id: newBookingId,
      serviceId: bookingData.serviceId || 'ac-jet-service',
      serviceTitle: bookingData.serviceTitle || 'Appliance Care Service',
      selectedOption: bookingData.selectedOption || {
        id: 'opt-gen-1',
        title: 'Standard Care Package',
        description: 'Complete diagnostic and tune-up service',
        price: optionPrice,
        durationMinutes: 45,
        features: ['Certified technician inspection', '30-day warranty'],
      },
      categoryName: bookingData.categoryName || 'General Appliance Care',
      brandName: bookingData.brandName,
      productName: bookingData.productName,
      status: 'scheduled',
      scheduledDate: bookingData.scheduledDate || 'Tomorrow',
      scheduledTimeSlot: bookingData.scheduledTimeSlot || '10:00 AM - 12:00 PM',
      address: bookingData.address || {
        id: 'addr-1',
        title: 'Home',
        street: 'Flat 402, Green Valley Apartments, HSR Layout',
        city: 'Bengaluru',
        state: 'Karnataka',
        zipCode: '560102',
      },
      paymentMethod: bookingData.paymentMethod || {
        id: 'pay-upi',
        type: 'upi',
        title: 'Google Pay (UPI)',
        details: 'Instant confirmation',
      },
      totalAmount: bookingData.totalAmount || total,
      steps: [
        { id: '1', title: 'Booking Confirmed', completed: true, timestamp: 'Just now' },
        { id: '2', title: 'Technician Assignment', completed: false },
        { id: '3', title: 'Technician En Route', completed: false },
        { id: '4', title: 'Service Execution', completed: false },
        { id: '5', title: 'Completion & Invoice', completed: false },
      ],
      createdAt: new Date().toISOString(),
    };

    mockBookings.unshift(newBooking);
    return api.post(newBooking);
  },
};
