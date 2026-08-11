import { IGetUsersUseCase } from '../../domain/interface/useCaseInterface/IGetUsersUseCase';
import { UserResponseDTO } from '../../domain/interface/DTOs/UserDTO';
import { IUserRepository } from '../../domain/interface/repositoryInterface/IUserRepository';

export class GetUsersUseCase implements IGetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findAll();
    return users.map((user) => ({
      id: user.id!,
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
