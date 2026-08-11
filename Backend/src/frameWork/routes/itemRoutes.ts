import { Router } from 'express';
import { itemController } from '../DI/itemInject';
import { jwtMiddleware } from '../DI/authInject';
import { requireRole } from '../../adapters/middlewares/authorization/roleMiddleware';
import { UserRole } from '../../domain/entities/User';

const router = Router();

// Only STOCK_MANAGER and ADMIN can manage items
router.post(
  '/',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.STOCK_MANAGER),
  itemController.createItem
);

router.get(
  '/',
  jwtMiddleware,
  itemController.getItems // Usually everyone authenticated can view items, or just certain roles? Let's leave it open to all authenticated or we can restrict.
);

router.get(
  '/:id',
  jwtMiddleware,
  itemController.getItemById
);

router.patch(
  '/:id',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.STOCK_MANAGER),
  itemController.updateItem
);

router.delete(
  '/:id',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.STOCK_MANAGER),
  itemController.deleteItem
);

export default router;
