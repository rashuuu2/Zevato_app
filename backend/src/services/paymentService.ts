import prisma from '../db';
import { broadcastToUser } from '../socket';
import { sendPushNotificationToUser } from './notificationService';

export interface ProcessPaymentOptions {
  bookingId: string;
  userId: string;
  simulateOutcome?: 'success' | 'failed' | 'cancelled';
  paymentMethodType?: string;
}

export const FakePaymentService = {
  processSimulatedPayment: async (options: ProcessPaymentOptions) => {
    const { bookingId, userId, simulateOutcome = 'success', paymentMethodType } = options;

    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, userId },
      include: { service: true, serviceOption: true, address: true, technician: true },
    });

    if (!booking) {
      throw new Error('Booking not found or unauthorized access');
    }

    const simulatedTransactionId = `SIM-TXN-${Math.floor(100000 + Math.random() * 900000)}`;

    if (simulateOutcome === 'failed') {
      const updated = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: 'payment_failed',
          simulatedTransactionId,
          statusHistory: {
            create: {
              stepNumber: 1,
              title: 'Payment Failed (Simulated Test)',
              completed: false,
              timestamp: 'Just now',
              note: 'Simulated payment processing failed for development testing.',
            },
          },
        },
        include: { service: true, serviceOption: true, address: true, technician: true, statusHistory: true },
      });

      broadcastToUser(userId, 'payment:updated', {
        bookingId: booking.id,
        paymentStatus: 'payment_failed',
        simulatedTransactionId,
        message: 'Simulated payment failed',
      });

      broadcastToUser(userId, 'booking:status_updated', {
        bookingId: booking.id,
        status: updated.bookingStatus,
        paymentStatus: updated.paymentStatus,
      });

      await sendPushNotificationToUser(
        userId,
        'Payment Failed',
        `Simulated payment for booking ${booking.bookingNumber} failed. Please try again.`
      );

      return {
        success: false,
        paymentStatus: 'payment_failed',
        simulatedTransactionId,
        booking: updated,
      };
    }

    if (simulateOutcome === 'cancelled') {
      const updated = await prisma.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: 'payment_cancelled',
          simulatedTransactionId,
        },
        include: { service: true, serviceOption: true, address: true, technician: true, statusHistory: true },
      });

      broadcastToUser(userId, 'payment:updated', {
        bookingId: booking.id,
        paymentStatus: 'payment_cancelled',
        simulatedTransactionId,
        message: 'Simulated payment cancelled by user',
      });

      return {
        success: false,
        paymentStatus: 'payment_cancelled',
        simulatedTransactionId,
        booking: updated,
      };
    }

    // Default Successful Simulated Payment
    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        paymentStatus: 'payment_paid',
        bookingStatus: 'scheduled',
        simulatedTransactionId,
        paidAt: new Date(),
        paymentMethodType: paymentMethodType || booking.paymentMethodType,
      },
      include: { service: true, serviceOption: true, address: true, technician: true, statusHistory: true },
    });

    broadcastToUser(userId, 'payment:updated', {
      bookingId: booking.id,
      paymentStatus: 'payment_paid',
      simulatedTransactionId,
      paidAt: updated.paidAt?.toISOString(),
      message: 'Simulated payment processed successfully',
    });

    broadcastToUser(userId, 'booking:status_updated', {
      bookingId: booking.id,
      status: updated.bookingStatus,
      paymentStatus: updated.paymentStatus,
    });

    await sendPushNotificationToUser(
      userId,
      'Payment Confirmed! 🎉',
      `Payment of ₹${booking.total} received for booking ${booking.bookingNumber}. Technician assigned!`
    );

    return {
      success: true,
      paymentStatus: 'payment_paid',
      simulatedTransactionId,
      paidAt: updated.paidAt,
      booking: updated,
    };
  },
};

export default FakePaymentService;
