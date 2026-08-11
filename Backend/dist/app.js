"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./frameWork/routes/authRoutes"));
const donationRoutes_1 = __importDefault(require("./frameWork/routes/donationRoutes"));
const lotRoutes_1 = __importDefault(require("./frameWork/routes/lotRoutes"));
const aiRoutes_1 = __importDefault(require("./frameWork/routes/aiRoutes"));
const itemRoutes_1 = __importDefault(require("./frameWork/routes/itemRoutes"));
const errorMiddleware_1 = require("./adapters/middlewares/error/errorMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
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
app.use('/api/donations', donationRoutes_1.default);
app.use('/api/lots', lotRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.use('/api/items', itemRoutes_1.default);
// Centralized Error Handling Middleware
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
