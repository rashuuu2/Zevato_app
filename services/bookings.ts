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
    const newBooking: Booking = {
      id: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
      serviceId: bookingData.serviceId || 'ac-jet-service',
      serviceTitle: bookingData.serviceTitle || 'Service',
      selectedOption: bookingData.selectedOption!,
      categoryName: bookingData.categoryName || 'General',
      status: 'scheduled',
      scheduledDate: bookingData.scheduledDate || 'Tomorrow',
      scheduledTimeSlot: bookingData.scheduledTimeSlot || '10:00 AM - 12:00 PM',
      address: bookingData.address!,
      paymentMethod: bookingData.paymentMethod!,
      totalAmount: bookingData.totalAmount || 599,
      createdAt: new Date().toISOString(),
    };
    mockBookings.unshift(newBooking);
    return api.post(newBooking);
  },
};
