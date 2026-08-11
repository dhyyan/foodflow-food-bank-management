"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const distributionInject_1 = require("../DI/distributionInject");
const authInject_1 = require("../DI/authInject");
const roleMiddleware_1 = require("../../adapters/middlewares/authorization/roleMiddleware");
const User_1 = require("../../domain/entities/User");
const router = (0, express_1.Router)();
// Distribution list
router.get('/', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.HANDOUT_COORDINATOR, User_1.UserRole.STOCK_MANAGER), distributionInject_1.distributionController.listDistributions);
// Preview allocation (FEFO vs Strategic Reserve Buffer)
router.post('/preview-allocation', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.HANDOUT_COORDINATOR, User_1.UserRole.STOCK_MANAGER), distributionInject_1.distributionController.previewAllocation);
// Create Distribution
router.post('/', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.HANDOUT_COORDINATOR), distributionInject_1.distributionController.createDistribution);
exports.default = router;
