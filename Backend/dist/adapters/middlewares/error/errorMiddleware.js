"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: {
                code: err.code
            }
        });
    }
    console.error('[Unhandled Error]:', err);
    return res.status(500).json({
        success: false,
        message: 'An unexpected internal server error occurred',
        error: {
            code: 'INTERNAL_SERVER_ERROR'
        }
    });
};
exports.errorHandler = errorHandler;
