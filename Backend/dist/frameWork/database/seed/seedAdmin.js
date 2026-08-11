"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialAdmin = void 0;
const UserModel_1 = require("../models/UserModel");
const PasswordService_1 = require("../../service/password/PasswordService");
const User_1 = require("../../../domain/entities/User");
const seedInitialAdmin = async () => {
    try {
        const adminCount = await UserModel_1.UserModel.countDocuments({ role: User_1.UserRole.ADMIN });
        if (adminCount === 0) {
            const passwordService = new PasswordService_1.PasswordService();
            const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123456';
            const passwordHash = await passwordService.hash(defaultPassword);
            await UserModel_1.UserModel.create({
                name: 'System Admin',
                email: 'admin@foodflow.org',
                passwordHash,
                role: User_1.UserRole.ADMIN,
                isActive: true
            });
            console.log('====================================================');
            console.log('[Seed] Initial Admin user created:');
            console.log('       Email: admin@foodflow.org');
            console.log(`       Password: ${defaultPassword}`);
            console.log('====================================================');
        }
    }
    catch (error) {
        console.error('[Seed Error] Failed to seed initial admin user:', error);
    }
};
exports.seedInitialAdmin = seedInitialAdmin;
