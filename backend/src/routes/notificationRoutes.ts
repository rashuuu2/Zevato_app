import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { handleRegisterPushToken } from '../controllers/notificationController';

const router = Router();

router.post('/notifications/register-token', authenticateUser, handleRegisterPushToken);

export default router;
