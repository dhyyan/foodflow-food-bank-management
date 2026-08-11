import { UserResponseDTO } from '../DTOs/UserDTO';

export interface IGetUsersUseCase {
  execute(): Promise<UserResponseDTO[]>;
}
