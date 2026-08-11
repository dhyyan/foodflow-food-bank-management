"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./frameWork/routes/authRoutes"));
const errorMiddleware_1 = require("./adapters/middlewares/error/errorMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health Check Endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'FoodFlow Backend API is running smoothly',
        timestamp: new Date()
    });
});
// API Routes
app.use('/api/auth', authRoutes_1.default);
// Centralized Error Handling Middleware
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
