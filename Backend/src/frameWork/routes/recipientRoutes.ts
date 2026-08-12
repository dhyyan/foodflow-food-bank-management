import { Router } from 'express';
import { recipientController } from '../DI/distributionInject';
import { jwtMiddleware } from '../DI/authInject';
import { requireRole } from '../../adapters/middlewares/authorization/roleMiddleware';
import { UserRole } from '../../domain/entities/User';

const router = Router();

router.get(
  '/check-quota',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.HANDOUT_COORDINATOR, UserRole.DONATION_CLERK, UserRole.STOCK_MANAGER),
  recipientController.checkQuota
);

router.get(
  '/',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.HANDOUT_COORDINATOR, UserRole.DONATION_CLERK, UserRole.STOCK_MANAGER),
  recipientController.getAll
);

router.post(
  '/',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.HANDOUT_COORDINATOR),
  recipientController.create
);

export default router;
