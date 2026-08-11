import { Router } from 'express';
import { donationController } from '../DI/donationInject';
import { jwtMiddleware } from '../DI/authInject';
import { requireRole } from '../../adapters/middlewares/authorization/roleMiddleware';
import { UserRole } from '../../domain/entities/User';

const router = Router();

// Create new donation (Admin or Donation Clerk)
router.post(
  '/',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.DONATION_CLERK),
  donationController.createDonation
);

// View donations list (Admin, Donation Clerk, or Stock Manager)
router.get(
  '/',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.DONATION_CLERK, UserRole.STOCK_MANAGER),
  donationController.getDonations
);

// View donation details with line items and created lots
router.get(
  '/:id',
  jwtMiddleware,
  requireRole(UserRole.ADMIN, UserRole.DONATION_CLERK, UserRole.STOCK_MANAGER),
  donationController.getDonationById
);

export default router;
