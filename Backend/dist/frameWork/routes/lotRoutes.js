"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lotInject_1 = require("../DI/lotInject");
const authInject_1 = require("../DI/authInject");
const roleMiddleware_1 = require("../../adapters/middlewares/authorization/roleMiddleware");
const User_1 = require("../../domain/entities/User");
const router = (0, express_1.Router)();
// View lots list (Admin, Donation Clerk, Stock Manager, Handout Coordinator)
router.get('/', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.DONATION_CLERK, User_1.UserRole.STOCK_MANAGER, User_1.UserRole.HANDOUT_COORDINATOR), lotInject_1.lotController.getLots);
// Get lot trace history timeline (Admin, Donation Clerk, Stock Manager, Handout Coordinator)
router.get('/:id/trace', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.DONATION_CLERK, User_1.UserRole.STOCK_MANAGER, User_1.UserRole.HANDOUT_COORDINATOR), lotInject_1.lotController.getLotTrace);
// Get single lot details (Admin, Donation Clerk, Stock Manager, Handout Coordinator)
router.get('/:id', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.DONATION_CLERK, User_1.UserRole.STOCK_MANAGER, User_1.UserRole.HANDOUT_COORDINATOR), lotInject_1.lotController.getLotById);
// Physical inspection, shelving, quarantine, and discard status transitions (Admin, Stock Manager)
router.patch('/:id/status', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.STOCK_MANAGER), lotInject_1.lotController.transitionStatus);
exports.default = router;
