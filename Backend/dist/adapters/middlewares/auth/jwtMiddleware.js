"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJwtMiddleware = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
const createJwtMiddleware = (jwtService) => {
    return (req, _res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new AppError_1.UnauthorizedError('Authentication token missing or malformed'));
        }
        const token = authHeader.split(' ')[1];
        const payload = jwtService.verifyToken(token);
        if (!payload) {
            return next(new AppError_1.UnauthorizedError('Invalid or expired authentication token'));
        }
        req.user = payload;
        return next();
    };
};
exports.createJwtMiddleware = createJwtMiddleware;
