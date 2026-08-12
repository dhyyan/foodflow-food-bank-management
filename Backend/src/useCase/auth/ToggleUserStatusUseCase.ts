import { IToggleUserStatusUseCase, ToggleUserStatusDTO } from '../../domain/interface/useCaseInterface/IToggleUserStatusUseCase';
import { UserResponseDTO } from '../../domain/interface/DTOs/UserDTO';
import { IUserRepository } from '../../domain/interface/repositoryInterface/IUserRepository';
import { BadRequestError, NotFoundError } from '../../shared/errors/AppError';

export class ToggleUserStatusUseCase implements IToggleUserStatusUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: ToggleUserStatusDTO): Promise<UserResponseDTO> {
    if (!dto.userId) {
      throw new BadRequestError('User ID is required');
    }

    if (typeof dto.isActive !== 'boolean') {
      throw new BadRequestError('Target isActive status must be a boolean');
    }

    if (dto.adminId && dto.adminId === dto.userId && dto.isActive === false) {
      throw new BadRequestError('You cannot block your own active admin account');
    }

    const existingUser = await this.userRepository.findById(dto.userId);
    if (!existingUser) {
      throw new NotFoundError('User account not found');
    }

    const updatedUser = await this.userRepository.updateStatus(dto.userId, dto.isActive);
    if (!updatedUser) {
      throw new Error('Failed to update user account status');
    }

    return {
      id: updatedUser.id!,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      createdBy: updatedUser.createdBy,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };
  }
}
