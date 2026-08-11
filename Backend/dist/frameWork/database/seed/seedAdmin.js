"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialAdmin = void 0;
const UserModel_1 = require("../models/UserModel");
const PasswordService_1 = require("../../service/password/PasswordService");
const User_1 = require("../../../domain/entities/User");
const seedInitialAdmin = async () => {
    try {
        const passwordService = new PasswordService_1.PasswordService();
        // Seed default admin if missing
        const adminCount = await UserModel_1.UserModel.countDocuments({ role: User_1.UserRole.ADMIN });
        if (adminCount === 0) {
            const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123456';
            const passwordHash = await passwordService.hash(defaultPassword);
            await UserModel_1.UserModel.create({
                name: 'System Admin',
                email: 'admin@foodflow.org',
                passwordHash,
                role: User_1.UserRole.ADMIN,
                isActive: true
            });
            console.log('[Seed] Initial Admin created: admin@foodflow.org');
        }
        // Seed default operational staff users if none exist
        const staffCount = await UserModel_1.UserModel.countDocuments({ role: { $ne: User_1.UserRole.ADMIN } });
        if (staffCount === 0) {
            const clerkPass = await passwordService.hash('Clerk@123456');
            const stockPass = await passwordService.hash('Stock@123456');
            const handoutPass = await passwordService.hash('Handout@123456');
            await UserModel_1.UserModel.create([
                {
                    name: 'Sarah Clerk',
                    email: 'clerk@foodflow.org',
                    passwordHash: clerkPass,
                    role: User_1.UserRole.DONATION_CLERK,
                    isActive: true
                },
                {
                    name: 'Marcus Stocker',
                    email: 'stock@foodflow.org',
                    passwordHash: stockPass,
                    role: User_1.UserRole.STOCK_MANAGER,
                    isActive: true
                },
                {
                    name: 'Elena Coordinator',
                    email: 'handout@foodflow.org',
                    passwordHash: handoutPass,
                    role: User_1.UserRole.HANDOUT_COORDINATOR,
                    isActive: true
                }
            ]);
            console.log('[Seed] Initial Staff Users created (clerk, stock, handout)');
        }
    }
    catch (error) {
        console.error('[Seed Error] Failed to seed initial users:', error);
    }
};
exports.seedInitialAdmin = seedInitialAdmin;
