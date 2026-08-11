"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aiInject_1 = require("../DI/aiInject");
const authInject_1 = require("../DI/authInject");
const roleMiddleware_1 = require("../../adapters/middlewares/authorization/roleMiddleware");
const User_1 = require("../../domain/entities/User");
const router = (0, express_1.Router)();
// AI Manifest Parser endpoint (Admin, Donation Clerk, or Stock Manager)
router.post('/parse-manifest', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.DONATION_CLERK, User_1.UserRole.STOCK_MANAGER), aiInject_1.aiController.parseManifest);
// AI Vision Photo Manifest Parser endpoint (Admin, Donation Clerk, or Stock Manager)
router.post('/parse-manifest-image', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.DONATION_CLERK, User_1.UserRole.STOCK_MANAGER), aiInject_1.aiController.parseManifestImage);
exports.default = router;
