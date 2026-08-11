import { Router } from 'express';
import { lotController } from '../DI/lotInject';
import { jwtMiddleware } from '../DI/authInject';
import { requireRole } from '../../adapters/middlewares/authorization/roleMiddleware';
import { UserRole } from '../../domain/entities/User';

const router = Router();

// View lots list (Admin, Donation Clerk, Stock Manager, Handout Coordinator)
router.get(
  '/',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.DONATION_CLERK, UserRole.STOCK_MANAGER, UserRole.HANDOUT_COORDINATOR),
  lotController.getLots
);

// Get lot trace history timeline (Admin, Donation Clerk, Stock Manager, Handout Coordinator)
router.get(
  '/:id/trace',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.DONATION_CLERK, UserRole.STOCK_MANAGER, UserRole.HANDOUT_COORDINATOR),
  lotController.getLotTrace
);

// Get single lot details (Admin, Donation Clerk, Stock Manager, Handout Coordinator)
router.get(
  '/:id',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.DONATION_CLERK, UserRole.STOCK_MANAGER, UserRole.HANDOUT_COORDINATOR),
  lotController.getLotById
);

// Physical inspection, shelving, quarantine, and discard status transitions (Admin, Stock Manager)
router.patch(
  '/:id/status',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.STOCK_MANAGER),
  lotController.transitionStatus
);

export default router;
