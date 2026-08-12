import { IGetUsersUseCase } from '../../domain/interface/useCaseInterface/IGetUsersUseCase';
import { UserFilterDTO, UserPaginatedResponseDTO, UserResponseDTO } from '../../domain/interface/DTOs/UserDTO';
import { IUserRepository } from '../../domain/interface/repositoryInterface/IUserRepository';

export class GetUsersUseCase implements IGetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(filter?: UserFilterDTO): Promise<UserPaginatedResponseDTO> {
    const page = filter?.page || 1;
    const limit = filter?.limit || 10;

    const { users, total } = await this.userRepository.findAll(filter);

    const userDTOs: UserResponseDTO[] = users.map((user) => ({
      id: user.id!,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdBy: user.createdBy,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      users: userDTOs,
      total,
      page,
      limit,
      totalPages
    };
  }
}

