"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
const requireRole = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new AppError_1.UnauthorizedError('User authentication context missing'));
        }
        const hasRole = allowedRoles.includes(req.user.role);
        if (!hasRole) {
            return next(new AppError_1.ForbiddenError(`User role '${req.user.role}' is not authorized to access this resource`));
        }
        return next();
    };
};
exports.requireRole = requireRole;
