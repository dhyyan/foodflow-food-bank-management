import { Router } from 'express';
import { distributionController } from '../DI/distributionInject';
import { jwtMiddleware } from '../DI/authInject';
import { requireRole } from '../../adapters/middlewares/authorization/roleMiddleware';
import { UserRole } from '../../domain/entities/User';

const router = Router();

// Distribution list
router.get(
  '/',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.HANDOUT_COORDINATOR, UserRole.STOCK_MANAGER),
  distributionController.listDistributions
);

// Preview allocation (FEFO vs Strategic Reserve Buffer)
router.post(
  '/preview-allocation',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.HANDOUT_COORDINATOR, UserRole.STOCK_MANAGER),
  distributionController.previewAllocation
);

// Create Distribution
router.post(
  '/',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.HANDOUT_COORDINATOR),
  distributionController.createDistribution
);

export default router;
