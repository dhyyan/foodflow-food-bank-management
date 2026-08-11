import { Router } from 'express';
import { notificationController } from '../DI/notificationInject';
import { jwtMiddleware } from '../DI/authInject';
import { requireRole } from '../../adapters/middlewares/authorization/roleMiddleware';
import { UserRole } from '../../domain/entities/User';

const router = Router();

// Trigger 48h Expiry Alert Email Check (Admin & Stock Manager)
router.post(
  '/expiry-alerts',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.STOCK_MANAGER),
  notificationController.triggerExpiryAlerts
);

// Trigger Daily Intake Summary Email (Admin & Handout Coordinator)
router.post(
  '/daily-summary',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.HANDOUT_COORDINATOR),
  notificationController.triggerDailySummary
);

// Notification Logs History
router.get(
  '/history',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.STOCK_MANAGER, UserRole.HANDOUT_COORDINATOR),
  notificationController.getHistory
);

export default router;
