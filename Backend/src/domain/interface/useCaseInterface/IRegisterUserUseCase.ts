import { RegisterUserDTO, UserResponseDTO } from '../DTOs/UserDTO';

export interface IRegisterUserUseCase {
  execute(dto: RegisterUserDTO): Promise<UserResponseDTO>;
}
