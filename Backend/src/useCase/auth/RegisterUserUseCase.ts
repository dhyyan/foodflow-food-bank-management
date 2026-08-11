import { IRegisterUserUseCase } from '../../domain/interface/useCaseInterface/IRegisterUserUseCase';
import { RegisterUserDTO, UserResponseDTO } from '../../domain/interface/DTOs/UserDTO';
import { IUserRepository } from '../../domain/interface/repositoryInterface/IUserRepository';
import { IPasswordService } from '../../domain/interface/serviceInterface/IPasswordService';
import { User, UserRole } from '../../domain/entities/User';
import { BadRequestError, ConflictError } from '../../shared/errors/AppError';

export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService
  ) {}

  async execute(dto: RegisterUserDTO): Promise<UserResponseDTO> {
    if (!dto.name || !dto.name.trim()) {
      throw new BadRequestError('User name is required');
    }
    if (!dto.email || !dto.email.trim()) {
      throw new BadRequestError('User email is required');
    }
    if (!dto.password || dto.password.length < 6) {
      throw new BadRequestError('Password must be at least 6 characters long');
    }
    if (!dto.role || !Object.values(UserRole).includes(dto.role)) {
      throw new BadRequestError(`Invalid user role: ${dto.role}`);
    }

    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictError(`User with email '${dto.email}' already exists`);
    }

    const passwordHash = await this.passwordService.hash(dto.password);

    const newUser = new User({
      name: dto.name.trim(),
      email: dto.email.trim(),
      passwordHash,
      role: dto.role,
      isActive: true,
      createdBy: dto.adminId
    });

    const savedUser = await this.userRepository.create(newUser);

    return {
      id: savedUser.id!,
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
