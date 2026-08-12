import { UserResponseDTO } from '../DTOs/UserDTO';

export interface ToggleUserStatusDTO {
  userId: string;
  isActive: boolean;
  adminId?: string;
}

export interface IToggleUserStatusUseCase {
  execute(dto: ToggleUserStatusDTO): Promise<UserResponseDTO>;
}
