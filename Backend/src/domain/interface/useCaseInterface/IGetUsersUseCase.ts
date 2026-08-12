import { UserFilterDTO, UserPaginatedResponseDTO } from '../DTOs/UserDTO';

export interface IGetUsersUseCase {
  execute(filter?: UserFilterDTO): Promise<UserPaginatedResponseDTO>;
}

