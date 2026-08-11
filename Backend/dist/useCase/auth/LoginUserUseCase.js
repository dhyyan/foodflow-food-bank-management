"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
const AppError_1 = require("../../shared/errors/AppError");
class LoginUserUseCase {
    userRepository;
    passwordService;
    jwtService;
    constructor(userRepository, passwordService, jwtService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.jwtService = jwtService;
    }
    async execute(dto) {
        if (!dto.email || !dto.email.trim()) {
            throw new AppError_1.BadRequestError('Email is required');
        }
        if (!dto.password) {
            throw new AppError_1.BadRequestError('Password is required');
        }
        const user = await this.userRepository.findByEmail(dto.email);
        if (!user) {
            throw new AppError_1.UnauthorizedError('Invalid email or password');
        }
        if (!user.isActive) {
            throw new AppError_1.UnauthorizedError('User account is deactivated');
        }
        const isPasswordValid = await this.passwordService.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new AppError_1.UnauthorizedError('Invalid email or password');
        }
        const token = this.jwtService.generateToken({
            id: user.id,
            email: user.email,
            role: user.role
        });
        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive,
                createdBy: user.createdBy,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            token
        };
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
