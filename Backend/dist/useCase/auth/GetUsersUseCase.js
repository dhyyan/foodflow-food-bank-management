"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUsersUseCase = void 0;
class GetUsersUseCase {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute() {
        const users = await this.userRepository.findAll();
        return users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdBy: user.createdBy,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }));
    }
}
exports.GetUsersUseCase = GetUsersUseCase;
