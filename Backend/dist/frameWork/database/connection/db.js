"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MONGODB_URI is not defined in environment variables');
    }
    try {
        const conn = await mongoose_1.default.connect(mongoUri);
        console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
        return conn;
    }
    catch (error) {
        console.error('[MongoDB] Connection failure:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
