"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./frameWork/database/connection/db");
const seedAdmin_1 = require("./frameWork/database/seed/seedAdmin");
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        await (0, seedAdmin_1.seedInitialAdmin)();
        app_1.default.listen(PORT, () => {
            console.log(`[Server] FoodFlow Backend server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('[Server Start Error]:', error);
        process.exit(1);
    }
};
startServer();
