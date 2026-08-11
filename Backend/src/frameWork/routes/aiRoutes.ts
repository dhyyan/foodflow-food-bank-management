import { Router } from 'express';
import { aiController } from '../DI/aiInject';
import { jwtMiddleware } from '../DI/authInject';
import { requireRole } from '../../adapters/middlewares/authorization/roleMiddleware';
import { UserRole } from '../../domain/entities/User';

const router = Router();

// AI Manifest Parser endpoint (Admin, Donation Clerk, or Stock Manager)
router.post(
  '/parse-manifest',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.DONATION_CLERK, UserRole.STOCK_MANAGER),
  aiController.parseManifest
);

export default router;
