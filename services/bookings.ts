import { api } from './api';
import { bookings as mockBookings } from '@/data/bookings';
import { Booking, BookingStatus } from '@/types/booking';

export const bookingService = {
  getAllBookings: async (status?: string): Promise<Booking[]> => {
    try {
      const endpoint = status ? `/bookings?status=${status}` : '/bookings';
      const data = await api.get<Booking[]>(endpoint);
      if (Array.isArray(data)) {
        return data;
      }
    } catch (e) {
      console.warn('bookingService.getAllBookings falling back to local data');
    }
    return mockBookings;
  },

  getBookingById: async (id: string): Promise<Booking | undefined> => {
    try {
      const data = await api.get<Booking>(`/bookings/${id}`);
      if (data && data.id) {
        return data;
      }
    } catch (e) {
      console.warn(`bookingService.getBookingById(${id}) falling back to local data`);
    }
    return mockBookings.find((b) => b.id === id) || mockBookings[0];
  },

  createBooking: async (bookingData: Partial<Booking>): Promise<Booking> => {
    try {
      const payload = {
        serviceId: bookingData.serviceId || 'ac-jet-service',
        serviceOptionId: bookingData.selectedOption?.id || 'opt-ac-1',
        categoryId: bookingData.categoryId,
        brandId: bookingData.brandId,
        productId: bookingData.productId,
        productVariantId: (bookingData as any).productVariantId,
        addressId: bookingData.address?.id || 'addr-1',
        address: bookingData.address,
        scheduledDate: bookingData.scheduledDate || 'Tomorrow',
        scheduledTimeSlot: bookingData.scheduledTimeSlot || '10:00 AM - 12:00 PM',
        paymentMethod: bookingData.paymentMethod || {
          type: 'upi',
          title: 'Google Pay (UPI)',
          details: 'Instant confirmation',
        },
        totalAmount: bookingData.totalAmount,
      };

      const created = await api.post<Booking>('/bookings', payload);
      if (created && created.id) {
        mockBookings.unshift(created);
        return created;
      }
    } catch (e) {
      console.warn('bookingService.createBooking falling back to client generation:', e);
    }

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newBookingId = `ZEV-2026-${randomNum}`;

    const optionPrice = bookingData.selectedOption?.price || 599;
    const tax = Math.round(optionPrice * 0.18);
    const total = optionPrice + tax;

    const newBooking: Booking = {
      id: newBookingId,
      bookingNumber: newBookingId,
      serviceId: bookingData.serviceId || 'ac-jet-service',
      serviceTitle: bookingData.serviceTitle || 'Appliance Care Service',
      selectedOption: bookingData.selectedOption || {
        id: 'opt-ac-1',
        title: 'Foam & Power Jet Service (1 Unit)',
        description: 'Complete deep cleaning using specialized jet pump and foam solution',
        price: optionPrice,
        durationMinutes: 45,
        features: ['High pressure jet pump wash', 'Anti-bacterial foam cleaning'],
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
      technician: {
        id: 'tech-101',
        name: 'Ramesh Kumar',
        phone: '+91 98765 43210',
        rating: 4.9,
        completedJobs: 428,
        avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
      },
      steps: [
        { id: '1', title: 'Booking Confirmed', completed: true, timestamp: 'Just now' },
        { id: '2', title: 'Technician Assigned', completed: true, timestamp: '1 min ago' },
        { id: '3', title: 'Technician On The Way', completed: false },
        { id: '4', title: 'Service Execution', completed: false },
        { id: '5', title: 'Completion & Invoice', completed: false },
      ],
      createdAt: new Date().toISOString(),
    };

    mockBookings.unshift(newBooking);
    return newBooking;
  },

  processFakePayment: async (
    bookingId: string,
    simulateOutcome: 'success' | 'failed' | 'cancelled' = 'success',
    paymentMethodType?: string
  ): Promise<any> => {
    try {
      const response = await api.post('/payments/process-fake', {
        bookingId,
        simulateOutcome,
        paymentMethodType,
      });
      return response;
    } catch (e: any) {
      console.warn('bookingService.processFakePayment fallback:', e);
      return {
        success: simulateOutcome === 'success',
        paymentStatus: simulateOutcome === 'success' ? 'payment_paid' : 'payment_failed',
        simulatedTransactionId: `SIM-TXN-${Date.now()}`,
      };
    }
  },

  updateBookingStatus: async (id: string, status: BookingStatus): Promise<Booking | undefined> => {
    try {
      const updated = await api.patch<Booking>(`/bookings/${id}/status`, { status });
      if (updated) return updated;
    } catch (e) {
      console.warn(`bookingService.updateBookingStatus(${id}) fallback:`, e);
    }
    const booking = mockBookings.find((b) => b.id === id);
    if (booking) {
      booking.status = status;
    }
    return booking;
  },

  cancelBooking: async (id: string, reason?: string): Promise<Booking | undefined> => {
    try {
      const cancelled = await api.post<Booking>(`/bookings/${id}/cancel`, { reason });
      if (cancelled) return cancelled;
    } catch (e) {
      console.warn(`bookingService.cancelBooking(${id}) fallback:`, e);
    }

    const booking = mockBookings.find((b) => b.id === id);
    if (booking) {
      booking.status = 'cancelled';
      if (booking.steps) {
        booking.steps = [
          ...booking.steps.filter((s) => s.completed),
          { id: 'cancel', title: `Cancelled: ${reason || 'User requested'}`, completed: true, timestamp: 'Just now' },
        ];
      }
    }
    return booking;
  },

  getBookingInvoice: async (id: string): Promise<any> => {
    try {
      return await api.get(`/bookings/${id}/invoice`);
    } catch (e) {
      console.warn(`bookingService.getBookingInvoice(${id}) fallback`);
      const booking = mockBookings.find((b) => b.id === id) || mockBookings[0];
      return booking.invoice || {
        id: `INV-${booking.id}`,
        bookingId: booking.id,
        date: '2026-08-30',
        subtotal: (booking.totalAmount || 599) * 0.85,
        tax: (booking.totalAmount || 599) * 0.15,
        discount: 0,
        total: booking.totalAmount || 599,
        items: [{ description: booking.serviceTitle, amount: booking.totalAmount || 599 }],
      };
    }
  },

  getServiceReport: async (id: string): Promise<any> => {
    try {
      return await api.get(`/bookings/${id}/report`);
    } catch (e) {
      console.warn(`bookingService.getServiceReport(${id}) fallback`);
      const booking = mockBookings.find((b) => b.id === id) || mockBookings[0];
      return {
        id: `REP-${booking.id}`,
        bookingId: booking.id,
        inspectionNotes: 'All systems inspected. Machine operating within normal parameters.',
        checklist: [
          { title: 'Cooling Efficiency Check', status: 'Passed' },
          { title: 'Electrical Safety Test', status: 'Passed' },
          { title: 'Filter Sanitation', status: 'Passed' },
        ],
        technicianNotes: 'No further action required.',
        technician: booking.technician,
        serviceTitle: booking.serviceTitle,
      };
    }
  },
};

export default bookingService;
