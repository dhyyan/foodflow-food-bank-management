import { Router } from 'express';
import { lotController } from '../DI/lotInject';
import { jwtMiddleware } from '../DI/authInject';
import { requireRole } from '../../adapters/middlewares/authorization/roleMiddleware';
import { UserRole } from '../../domain/entities/User';

const router = Router();

// View lots list (Admin, Donation Clerk, Stock Manager)
router.get(
  '/',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.DONATION_CLERK, UserRole.STOCK_MANAGER),
  lotController.getLots
);

export default router;
