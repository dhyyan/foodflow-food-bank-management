"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtService {
    secret;
    constructor() {
        this.secret = process.env.JWT_SECRET || 'fallback_secret_key_foodflow';
    }
    generateToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.secret, { expiresIn: '7d' });
    }
    verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.secret);
            return decoded;
        }
        catch {
            return null;
        }
    }
}
exports.JwtService = JwtService;
