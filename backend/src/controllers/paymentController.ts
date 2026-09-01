import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import FakePaymentService from '../services/paymentService';

export const processFakePayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { bookingId, simulateOutcome, paymentMethodType } = req.body;

    if (!bookingId) {
      res.status(422).json({ error: 'bookingId is required for payment processing' });
      return;
    }

    const result = await FakePaymentService.processSimulatedPayment({
      bookingId,
      userId,
      simulateOutcome: simulateOutcome || 'success',
      paymentMethodType,
    });

    res.json(result);
  } catch (error: any) {
    console.error('processFakePayment error:', error);
    res.status(500).json({ error: error.message || 'Failed to process simulated payment' });
  }
};
