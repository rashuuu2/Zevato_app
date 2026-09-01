import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBookingStatus,
  cancelBooking,
  getBookingStatus,
  getBookingInvoice,
  getServiceReport,
} from '../controllers/bookingController';

const router = Router();

router.get('/bookings', authenticateUser, getBookings);
router.post('/bookings', authenticateUser, createBooking);
router.get('/bookings/:id', authenticateUser, getBookingById);
router.patch('/bookings/:id/status', authenticateUser, updateBookingStatus);
router.post('/bookings/:id/cancel', authenticateUser, cancelBooking);
router.get('/bookings/:id/status', authenticateUser, getBookingStatus);
router.get('/bookings/:id/invoice', authenticateUser, getBookingInvoice);
router.get('/bookings/:id/report', authenticateUser, getServiceReport);

export default router;
