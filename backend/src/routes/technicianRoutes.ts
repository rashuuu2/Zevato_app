import { Router } from 'express';
import { updateTechnicianLocation } from '../controllers/technicianController';

const router = Router();

router.post('/technicians/update-location', updateTechnicianLocation);

export default router;
