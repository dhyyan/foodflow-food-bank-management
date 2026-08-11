import { LoginDTO, LoginResponseDTO } from '../DTOs/UserDTO';

export interface ILoginUserUseCase {
  execute(dto: LoginDTO): Promise<LoginResponseDTO>;
}
