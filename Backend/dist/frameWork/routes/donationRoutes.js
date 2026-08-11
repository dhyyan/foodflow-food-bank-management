"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const donationInject_1 = require("../DI/donationInject");
const authInject_1 = require("../DI/authInject");
const roleMiddleware_1 = require("../../adapters/middlewares/authorization/roleMiddleware");
const User_1 = require("../../domain/entities/User");
const router = (0, express_1.Router)();
// Create new donation (Admin or Donation Clerk)
router.post('/', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.DONATION_CLERK), donationInject_1.donationController.createDonation);
// View donations list (Admin, Donation Clerk, or Stock Manager)
router.get('/', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.DONATION_CLERK, User_1.UserRole.STOCK_MANAGER), donationInject_1.donationController.getDonations);
// View donation details with line items and created lots
router.get('/:id', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.DONATION_CLERK, User_1.UserRole.STOCK_MANAGER), donationInject_1.donationController.getDonationById);
exports.default = router;
