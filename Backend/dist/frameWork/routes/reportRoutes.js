"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportInject_1 = require("../DI/reportInject");
const authInject_1 = require("../DI/authInject");
const roleMiddleware_1 = require("../../adapters/middlewares/authorization/roleMiddleware");
const User_1 = require("../../domain/entities/User");
const router = (0, express_1.Router)();
// Waste Report Endpoint (Admin and Stock Manager)
router.get('/waste', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.STOCK_MANAGER), reportInject_1.reportController.getWasteReport);
exports.default = router;
