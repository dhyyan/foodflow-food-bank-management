import { Router } from 'express';
import { distributionController } from '../DI/distributionInject';
import { jwtMiddleware } from '../DI/authInject';
import { requireRole } from '../../adapters/middlewares/authorization/roleMiddleware';
import { UserRole } from '../../domain/entities/User';

const router = Router();

// List distributions
router.get(
  '/',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.HANDOUT_COORDINATOR, UserRole.DONATION_CLERK, UserRole.STOCK_MANAGER),
  distributionController.getAll
);

// Create distribution request
router.post(
  '/',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.HANDOUT_COORDINATOR),
  distributionController.create
);

// Get distribution details
router.get(
  '/:id',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.HANDOUT_COORDINATOR, UserRole.DONATION_CLERK, UserRole.STOCK_MANAGER),
  distributionController.getById
);

// FEFO Preview allocation
router.post(
  '/:id/preview',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.HANDOUT_COORDINATOR),
  distributionController.previewFEFO
);

// Confirm reservation (Apply FEFO, reserve inventory, create reservations)
router.post(
  '/:id/reserve',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.HANDOUT_COORDINATOR),
  distributionController.reserve
);

// Complete distribution (reserved -> released)
router.post(
  '/:id/complete',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.HANDOUT_COORDINATOR),
  distributionController.complete
);

export default router;
