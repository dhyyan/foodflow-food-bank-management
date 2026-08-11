"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const itemInject_1 = require("../DI/itemInject");
const authInject_1 = require("../DI/authInject");
const roleMiddleware_1 = require("../../adapters/middlewares/authorization/roleMiddleware");
const User_1 = require("../../domain/entities/User");
const router = (0, express_1.Router)();
// Only STOCK_MANAGER and ADMIN can manage items
router.post('/', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.STOCK_MANAGER), itemInject_1.itemController.createItem);
router.get('/', authInject_1.jwtMiddleware, itemInject_1.itemController.getItems // Usually everyone authenticated can view items, or just certain roles? Let's leave it open to all authenticated or we can restrict.
);
router.get('/:id', authInject_1.jwtMiddleware, itemInject_1.itemController.getItemById);
router.patch('/:id', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.STOCK_MANAGER), itemInject_1.itemController.updateItem);
router.delete('/:id', authInject_1.jwtMiddleware, (0, roleMiddleware_1.requireRole)(User_1.UserRole.ADMIN, User_1.UserRole.STOCK_MANAGER), itemInject_1.itemController.deleteItem);
exports.default = router;
