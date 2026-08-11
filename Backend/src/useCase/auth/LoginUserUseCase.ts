import { ILoginUserUseCase } from '../../domain/interface/useCaseInterface/ILoginUserUseCase';
import { LoginDTO, LoginResponseDTO } from '../../domain/interface/DTOs/UserDTO';
import { IUserRepository } from '../../domain/interface/repositoryInterface/IUserRepository';
import { IPasswordService } from '../../domain/interface/serviceInterface/IPasswordService';
import { IJwtService } from '../../domain/interface/serviceInterface/IJwtService';
import { BadRequestError, UnauthorizedError } from '../../shared/errors/AppError';

export class LoginUserUseCase implements ILoginUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordService: IPasswordService,
    private readonly jwtService: IJwtService
  ) {}

  async execute(dto: LoginDTO): Promise<LoginResponseDTO> {
    if (!dto.email || !dto.email.trim()) {
      throw new BadRequestError('Email is required');
    }
    if (!dto.password) {
      throw new BadRequestError('Password is required');
    }

    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('User account is deactivated');
    }

    const isPasswordValid = await this.passwordService.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.jwtService.generateToken({
      id: user.id!,
      email: user.email,
      role: user.role
    });

    return {
      user: {
        id: user.id!,
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
