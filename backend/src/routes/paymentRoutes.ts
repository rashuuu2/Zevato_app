import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { processFakePayment } from '../controllers/paymentController';

const router = Router();

router.post('/payments/process-fake', authenticateUser, processFakePayment);

export default router;
