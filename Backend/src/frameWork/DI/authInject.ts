import { UserRepository } from '../../adapters/repository/user/UserRepository';
import { PasswordService } from '../service/password/PasswordService';
import { JwtService } from '../service/jwt/JwtService';
import { RegisterUserUseCase } from '../../useCase/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '../../useCase/auth/LoginUserUseCase';
import { GetUsersUseCase } from '../../useCase/auth/GetUsersUseCase';
import { ToggleUserStatusUseCase } from '../../useCase/auth/ToggleUserStatusUseCase';
import { AuthController } from '../../adapters/controllers/auth/AuthController';
import { createJwtMiddleware } from '../../adapters/middlewares/auth/jwtMiddleware';

const userRepository = new UserRepository();
const passwordService = new PasswordService();
export const jwtService = new JwtService();

const registerUserUseCase = new RegisterUserUseCase(userRepository, passwordService);
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordService, jwtService);
const getUsersUseCase = new GetUsersUseCase(userRepository);
const toggleUserStatusUseCase = new ToggleUserStatusUseCase(userRepository);

export const authController = new AuthController(
  registerUserUseCase,
  loginUserUseCase,
  getUsersUseCase,
  toggleUserStatusUseCase
);

export const jwtMiddleware = createJwtMiddleware(jwtService);
