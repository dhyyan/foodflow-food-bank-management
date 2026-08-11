"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const distributionInject_1 = require("../DI/distributionInject");
const authInject_1 = require("../DI/authInject");
const roleMiddleware_1 = require("../../adapters/middlewares/authorization/roleMiddleware");
const User_1 = require("../../domain/entities/User");
const router = (0, express_1.Router)();
// List distributions
router.get('/', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.HANDOUT_COORDINATOR, User_1.UserRole.DONATION_CLERK, User_1.UserRole.STOCK_MANAGER), distributionInject_1.distributionController.getAll);
// Create distribution request
router.post('/', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.HANDOUT_COORDINATOR), distributionInject_1.distributionController.create);
// Get distribution details
router.get('/:id', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.HANDOUT_COORDINATOR, User_1.UserRole.DONATION_CLERK, User_1.UserRole.STOCK_MANAGER), distributionInject_1.distributionController.getById);
// FEFO Preview allocation
router.post('/:id/preview', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.HANDOUT_COORDINATOR), distributionInject_1.distributionController.previewFEFO);
// Confirm reservation (Apply FEFO, reserve inventory, create reservations)
router.post('/:id/reserve', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.HANDOUT_COORDINATOR), distributionInject_1.distributionController.reserve);
// Complete distribution (reserved -> released)
router.post('/:id/complete', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.HANDOUT_COORDINATOR), distributionInject_1.distributionController.complete);
exports.default = router;
