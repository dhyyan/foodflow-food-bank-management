"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authInject_1 = require("../DI/authInject");
const roleMiddleware_1 = require("../../adapters/middlewares/authorization/roleMiddleware");
const User_1 = require("../../domain/entities/User");
const router = (0, express_1.Router)();
// Public routes
router.post('/login', authInject_1.authController.login);
// Protected routes (Requires valid JWT)
router.get('/me', authInject_1.jwtMiddleware, authInject_1.authController.me);
// Admin-only routes: Admin registers users with specific role
router.post('/register', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN), authInject_1.authController.register);
router.get('/users', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN), authInject_1.authController.getUsers);
exports.default = router;
