import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import {
  getProfile,
  updateProfile,
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/userController';

const router = Router();

router.get('/me', authenticateUser, getProfile);
router.patch('/me', authenticateUser, updateProfile);

router.get('/addresses', authenticateUser, getAddresses);
router.post('/addresses', authenticateUser, createAddress);
router.patch('/addresses/:id', authenticateUser, updateAddress);
router.delete('/addresses/:id', authenticateUser, deleteAddress);

export default router;
