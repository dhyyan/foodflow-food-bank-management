import { Router } from 'express';
import { reportController } from '../DI/reportInject';
import { jwtMiddleware } from '../DI/authInject';
import { requireRole } from '../../adapters/middlewares/authorization/roleMiddleware';
import { UserRole } from '../../domain/entities/User';

const router = Router();

// Waste Report Endpoint (Admin and Stock Manager)
router.get(
  '/waste',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.STOCK_MANAGER),
  reportController.getWasteReport
);

export default router;
