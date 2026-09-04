import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import prisma from '../db';
import { broadcastToUser } from '../socket';
import { sendPushNotificationToUser } from '../services/notificationService';

export const getBookings = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { status } = req.query;
    const where: any = { userId };
    if (status && typeof status === 'string') {
      if (status === 'active') {
        where.bookingStatus = { in: ['scheduled', 'technician_assigned', 'in_progress'] };
      } else {
        where.bookingStatus = status;
      }
    }

    let bookings = await prisma.booking.findMany({
      where,
      include: {
        service: true,
        serviceOption: true,
        address: true,
        technician: true,
        category: true,
        brand: true,
        product: true,
        productVariant: true,
        statusHistory: { orderBy: { stepNumber: 'asc' } },
        invoice: true,
        serviceReport: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (bookings.length === 0) {
      const devWhere: any = {};
      if (status && typeof status === 'string') {
        if (status === 'active') {
          devWhere.bookingStatus = { in: ['scheduled', 'technician_assigned', 'in_progress'] };
        } else {
          devWhere.bookingStatus = status;
        }
      }
      bookings = await prisma.booking.findMany({
        where: devWhere,
        include: {
          service: true,
          serviceOption: true,
          address: true,
          technician: true,
          category: true,
          brand: true,
          product: true,
          productVariant: true,
          statusHistory: { orderBy: { stepNumber: 'asc' } },
          invoice: true,
          serviceReport: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 30,
      });
    }

    const formatted = bookings.map((b) => formatBookingResponse(b));
    res.json(formatted);
  } catch (error) {
    console.error('getBookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getBookingById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const booking = await prisma.booking.findFirst({
      where: {
        OR: [
          { id },
          { bookingNumber: id },
        ],
      },
      include: {
        service: true,
        serviceOption: true,
        address: true,
        technician: true,
        category: true,
        brand: true,
        product: true,
        productVariant: true,
        statusHistory: { orderBy: { stepNumber: 'asc' } },
        invoice: true,
        serviceReport: true,
      },
    });

    if (!booking) {
      res.status(404).json({ error: 'Booking not found or access denied' });
      return;
    }

    res.json(formatBookingResponse(booking));
  } catch (error) {
    console.error('getBookingById error:', error);
    res.status(500).json({ error: 'Failed to fetch booking details' });
  }
};

export const createBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const {
      serviceId,
      serviceOptionId,
      categoryId,
      brandId,
      productId,
      productVariantId,
      addressId,
      scheduledDate,
      scheduledTimeSlot,
      paymentMethod,
      totalAmount,
    } = req.body;

    let option = serviceOptionId
      ? await prisma.serviceOption.findUnique({
          where: { id: serviceOptionId },
          include: { service: true },
        })
      : null;

    if (!option) {
      const service = await prisma.service.findFirst({
        where: {
          OR: [
            { id: serviceId || 'ac-jet-service' },
            { categoryId: categoryId || 'ac' },
          ],
        },
        include: { options: true },
      });

      if (service && service.options.length > 0) {
        option = { ...service.options[0], service };
      } else {
        option = await prisma.serviceOption.findFirst({
          include: { service: true },
        });
      }
    }

    if (!option) {
      res.status(404).json({ error: 'Service catalog unavailable' });
      return;
    }

    let address = addressId
      ? await prisma.address.findFirst({
          where: { id: addressId, userId },
        })
      : null;

    if (!address) {
      const userAddresses = await prisma.address.findMany({ where: { userId } });
      if (userAddresses.length > 0) {
        address = userAddresses[0];
      } else {
        address = await prisma.address.create({
          data: {
            userId,
            title: 'Home',
            street: req.body.address?.street || 'Flat 402, Green Valley Apartments',
            city: req.body.address?.city || 'Bengaluru',
            state: req.body.address?.state || 'Karnataka',
            zipCode: req.body.address?.zipCode || '560102',
            isDefault: true,
          },
        });
      }
    }

    const technician = await prisma.technician.findFirst({
      where: { availability: 'available' },
    });

    const subtotal = option.price || 499;
    const discount = 100;
    const tax = Math.round(Math.max(0, subtotal - discount) * 0.18);
    const total = totalAmount || (subtotal - discount + tax);

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const bookingNumber = `ZEV-2026-${randomNum}`;

    const newBooking = await prisma.booking.create({
      data: {
        bookingNumber,
        userId,
        serviceId: option.serviceId,
        serviceOptionId: option.id,
        categoryId: categoryId || option.service.categoryId,
        brandId: brandId || null,
        productId: productId || null,
        productVariantId: productVariantId || null,
        addressId: address.id,
        technicianId: technician?.id || null,
        scheduledDate: scheduledDate || 'Tomorrow',
        scheduledTimeSlot: scheduledTimeSlot || '10:00 AM - 12:00 PM',
        paymentMethodType: paymentMethod?.type || 'upi',
        paymentMethodTitle: paymentMethod?.title || 'Google Pay (UPI)',
        paymentMethodDetails: paymentMethod?.details || 'Instant confirmation',
        paymentStatus: 'payment_pending',
        bookingStatus: 'scheduled',
        subtotal,
        discount,
        tax,
        total,
        statusHistory: {
          create: [
            { stepNumber: 1, title: 'Booking Confirmed', completed: true, timestamp: 'Just now' },
            { stepNumber: 2, title: 'Technician Assigned', completed: true, timestamp: '1 min ago' },
            { stepNumber: 3, title: 'Technician On The Way', completed: false },
            { stepNumber: 4, title: 'Service Execution', completed: false },
            { stepNumber: 5, title: 'Completion & Invoice', completed: false },
          ],
        },
        invoice: {
          create: {
            invoiceNumber: `INV-${randomNum}`,
            userId,
            subtotal,
            discount,
            tax,
            total,
            itemsJson: JSON.stringify([
              { description: option.title, amount: subtotal },
              { description: 'Discount Applied', amount: -discount },
              { description: 'GST (18%)', amount: tax },
            ]),
          },
        },
        serviceReport: {
          create: {
            inspectionNotes: 'Initial inspection completed during service intake.',
            checklistJson: JSON.stringify([
              { title: 'Cooling Efficiency Check', status: 'Passed' },
              { title: 'Electrical Safety Test', status: 'Passed' },
              { title: 'Filter Sanitation', status: 'Passed' },
            ]),
            technicianNotes: 'Appliance is performing within standard operating range.',
          },
        },
      },
      include: {
        service: true,
        serviceOption: true,
        address: true,
        technician: true,
        category: true,
        brand: true,
        product: true,
        statusHistory: { orderBy: { stepNumber: 'asc' } },
        invoice: true,
        serviceReport: true,
      },
    });

    const response = formatBookingResponse(newBooking);

    broadcastToUser(userId, 'booking:created', response);

    res.status(201).json(response);
    return;
  } catch (error) {
    console.error('createBooking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const updateBookingStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const existing = await prisma.booking.findFirst({
      where: { id, userId },
      include: { statusHistory: true },
    });

    if (!existing) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    let isCompleted = status === 'completed';

    if (isCompleted) {
      await prisma.bookingStatusHistory.updateMany({
        where: { bookingId: id },
        data: { completed: true },
      });
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: {
        bookingStatus: status,
        ...(isCompleted && { paymentStatus: 'payment_paid' }),
      },
      include: {
        service: true,
        serviceOption: true,
        address: true,
        technician: true,
        statusHistory: { orderBy: { stepNumber: 'asc' } },
        invoice: true,
        serviceReport: true,
      },
    });

    const response = formatBookingResponse(updated);

    broadcastToUser(userId, 'booking:status_updated', {
      bookingId: updated.id,
      status: updated.bookingStatus,
      paymentStatus: updated.paymentStatus,
    });

    if (isCompleted) {
      broadcastToUser(userId, 'booking:completed', response);
      await sendPushNotificationToUser(
        userId,
        'Service Completed! 🎉',
        `Your service for ${updated.service?.title || 'Appliance'} is completed. View report and tax invoice now.`
      );
    } else if (status === 'in_progress') {
      await sendPushNotificationToUser(
        userId,
        'Service Started 🛠️',
        `Technician ${updated.technician?.name || ''} has started your service.`
      );
    }

    res.json(response);
  } catch (error) {
    console.error('updateBookingStatus error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

export const cancelBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const { reason } = req.body;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const booking = await prisma.booking.findFirst({
      where: { id, userId },
      include: { statusHistory: true },
    });

    if (!booking) {
      res.status(404).json({ error: 'Booking not found or access denied' });
      return;
    }

    if (booking.bookingStatus === 'completed') {
      res.status(400).json({ error: 'Completed bookings cannot be cancelled' });
      return;
    }

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        bookingStatus: 'cancelled',
        cancellationReason: reason || 'User requested cancellation',
        paymentStatus: 'payment_cancelled',
        statusHistory: {
          create: {
            stepNumber: (booking.statusHistory.length || 0) + 1,
            title: `Cancelled: ${reason || 'User requested'}`,
            completed: true,
            timestamp: 'Just now',
            note: reason || 'Cancelled by customer',
          },
        },
      },
      include: {
        service: true,
        serviceOption: true,
        address: true,
        technician: true,
        statusHistory: { orderBy: { stepNumber: 'asc' } },
        invoice: true,
      },
    });

    const response = formatBookingResponse(updated);

    broadcastToUser(userId, 'booking:cancelled', {
      bookingId: booking.id,
      reason,
    });

    await sendPushNotificationToUser(
      userId,
      'Booking Cancelled',
      `Booking ${booking.bookingNumber} has been cancelled successfully.`
    );

    res.json(response);
  } catch (error) {
    console.error('cancelBooking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};

export const getBookingStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const booking = await prisma.booking.findFirst({
      where: { id, userId },
      include: {
        technician: true,
        statusHistory: { orderBy: { stepNumber: 'asc' } },
      },
    });

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    res.json({
      bookingId: booking.id,
      status: booking.bookingStatus,
      paymentStatus: booking.paymentStatus,
      technician: booking.technician,
      steps: booking.statusHistory.map((s) => ({
        id: s.id,
        title: s.title,
        completed: s.completed,
        timestamp: s.timestamp || undefined,
      })),
    });
  } catch (error) {
    console.error('getBookingStatus error:', error);
    res.status(500).json({ error: 'Failed to fetch status' });
  }
};

export const getBookingInvoice = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const invoice = await prisma.invoice.findFirst({
      where: { bookingId: id, userId },
      include: {
        booking: {
          include: {
            service: true,
            serviceOption: true,
            address: true,
            user: true,
          },
        },
      },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    res.json({
      id: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      bookingId: invoice.bookingId,
      date: invoice.issuedAt.toISOString().split('T')[0],
      subtotal: invoice.subtotal,
      discount: invoice.discount,
      tax: invoice.tax,
      total: invoice.total,
      items: JSON.parse(invoice.itemsJson || '[]'),
      user: {
        name: invoice.booking.user.name,
        email: invoice.booking.user.email,
        address: invoice.booking.address,
      },
    });
  } catch (error) {
    console.error('getBookingInvoice error:', error);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
};

export const getServiceReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const report = await prisma.serviceReport.findFirst({
      where: {
        bookingId: id,
        booking: { userId },
      },
      include: {
        booking: {
          include: {
            service: true,
            technician: true,
          },
        },
      },
    });

    if (!report) {
      res.status(404).json({ error: 'Service report not found' });
      return;
    }

    res.json({
      id: report.id,
      bookingId: report.bookingId,
      inspectionNotes: report.inspectionNotes,
      checklist: JSON.parse(report.checklistJson || '[]'),
      technicianNotes: report.technicianNotes,
      technician: report.booking.technician,
      serviceTitle: report.booking.service.title,
      completedAt: report.createdAt,
    });
  } catch (error) {
    console.error('getServiceReport error:', error);
    res.status(500).json({ error: 'Failed to fetch service report' });
  }
};

function formatBookingResponse(b: any) {
  return {
    id: b.id,
    bookingNumber: b.bookingNumber,
    serviceId: b.serviceId,
    serviceTitle: b.service?.title || 'Appliance Care Service',
    selectedOption: b.serviceOption
      ? {
          id: b.serviceOption.id,
          title: b.serviceOption.title,
          description: b.serviceOption.description,
          price: b.serviceOption.price,
          durationMinutes: b.serviceOption.durationMinutes,
          features: JSON.parse(b.serviceOption.featuresJson || '[]'),
        }
      : undefined,
    categoryId: b.categoryId,
    categoryName: b.category?.name || 'Appliance Care',
    brandId: b.brandId,
    brandName: b.brand?.name,
    productId: b.productId,
    productName: b.product?.name,
    productVariantId: b.productVariantId,
    productVariant: b.productVariant
      ? {
          id: b.productVariant.id,
          modelNumber: b.productVariant.modelNumber,
          sizeLabel: b.productVariant.sizeLabel,
          sizeValue: b.productVariant.sizeValue,
          price: b.productVariant.price,
          releaseYear: b.productVariant.releaseYear,
        }
      : undefined,
    status: b.bookingStatus,
    paymentStatus: b.paymentStatus,
    simulatedTransactionId: b.simulatedTransactionId,
    paidAt: b.paidAt ? b.paidAt.toISOString() : undefined,
    scheduledDate: b.scheduledDate,
    scheduledTimeSlot: b.scheduledTimeSlot,
    address: b.address
      ? {
          id: b.address.id,
          title: b.address.title,
          street: b.address.street,
          city: b.address.city,
          state: b.address.state,
          zipCode: b.address.zipCode,
        }
      : undefined,
    paymentMethod: {
      id: 'pay-1',
      type: b.paymentMethodType,
      title: b.paymentMethodTitle,
      details: b.paymentMethodDetails,
    },
    subtotal: b.subtotal,
    discount: b.discount,
    tax: b.tax,
    totalAmount: b.total,
    technician: b.technician
      ? {
          id: b.technician.id,
          name: b.technician.name,
          phone: b.technician.phone,
          rating: b.technician.rating,
          completedJobs: b.technician.completedJobs,
          avatarUrl: b.technician.avatarUrl,
          latitude: b.technician.currentLat,
          longitude: b.technician.currentLng,
        }
      : undefined,
    steps: b.statusHistory
      ? b.statusHistory.map((s: any) => ({
          id: s.id,
          title: s.title,
          completed: s.completed,
          timestamp: s.timestamp || undefined,
        }))
      : [],
    invoice: b.invoice
      ? {
          id: b.invoice.id,
          bookingId: b.id,
          date: b.invoice.issuedAt.toISOString().split('T')[0],
          subtotal: b.invoice.subtotal,
          tax: b.invoice.tax,
          discount: b.invoice.discount,
          total: b.invoice.total,
          items: JSON.parse(b.invoice.itemsJson || '[]'),
        }
      : undefined,
    createdAt: b.createdAt.toISOString(),
  };
}
