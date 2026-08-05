import { Router } from 'express';
import * as equipmentController from '../controllers/equipmentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);
router.post('/', equipmentController.create);
router.get('/', equipmentController.list);
router.get('/:id/status', equipmentController.status);
router.get('/:id', equipmentController.getById);
router.put('/:id', equipmentController.update);
router.delete('/:id', equipmentController.remove);

export default router;
