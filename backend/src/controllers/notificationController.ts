import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { registerPushToken } from '../services/notificationService';

export const handleRegisterPushToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { expoPushToken, deviceName } = req.body;
    if (!expoPushToken) {
      res.status(422).json({ error: 'expoPushToken is required' });
      return;
    }

    const record = await registerPushToken(userId, expoPushToken, deviceName);
    res.json({ message: 'Push token registered successfully', token: record });
  } catch (error) {
    console.error('handleRegisterPushToken error:', error);
    res.status(500).json({ error: 'Failed to register push token' });
  }
};
