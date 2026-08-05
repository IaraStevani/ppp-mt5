import { Router } from 'express';
import authRoutes from './authRoutes.js';
import equipmentRoutes from './equipmentRoutes.js';
import rentalRoutes from './rentalRoutes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

router.use('/auth', authRoutes);
router.use('/equipment', equipmentRoutes);
router.use('/rentals', rentalRoutes);

export default router;
