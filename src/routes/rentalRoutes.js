import { Router } from 'express';
import * as rentalController from '../controllers/rentalController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.post('/', rentalController.rent);
router.get('/', rentalController.list);
router.post('/returns', rentalController.returnEquipment);
router.get('/returns', rentalController.returns);

export default router;
