"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserUseCase = void 0;
const User_1 = require("../../domain/entities/User");
const AppError_1 = require("../../shared/errors/AppError");
class RegisterUserUseCase {
    userRepository;
    passwordService;
    constructor(userRepository, passwordService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }
    async execute(dto) {
        if (!dto.name || !dto.name.trim()) {
            throw new AppError_1.BadRequestError('User name is required');
        }
        if (!dto.email || !dto.email.trim()) {
            throw new AppError_1.BadRequestError('User email is required');
        }
        if (!dto.password || dto.password.length < 6) {
            throw new AppError_1.BadRequestError('Password must be at least 6 characters long');
        }
        if (!dto.role || !Object.values(User_1.UserRole).includes(dto.role)) {
            throw new AppError_1.BadRequestError(`Invalid user role: ${dto.role}`);
        }
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new AppError_1.ConflictError(`User with email '${dto.email}' already exists`);
        }
        const passwordHash = await this.passwordService.hash(dto.password);
        const newUser = new User_1.User({
            name: dto.name.trim(),
            email: dto.email.trim(),
            passwordHash,
            role: dto.role,
            isActive: true,
            createdBy: dto.adminId
        });
        const savedUser = await this.userRepository.create(newUser);
        return {
            id: savedUser.id,
            name: savedUser.name,
            email: savedUser.email,
            role: savedUser.role,
            isActive: savedUser.isActive,
            createdBy: savedUser.createdBy,
            createdAt: savedUser.createdAt,
            updatedAt: savedUser.updatedAt
        };
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
