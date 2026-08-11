import { Router } from 'express';
import { warehouseController } from '../DI/warehouseInject';
import { jwtMiddleware } from '../DI/authInject';
import { requireRole } from '../../adapters/middlewares/authorization/roleMiddleware';
import { UserRole } from '../../domain/entities/User';

const router = Router();

router.get('/', jwtMiddleware, warehouseController.getWarehouses);

router.post(
  '/transfer',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.STOCK_MANAGER),
  warehouseController.createTransfer
);

router.get('/transfers', jwtMiddleware, warehouseController.getTransfers);

export default router;
