import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth/jwtMiddleware';
import { IRegisterUserUseCase } from '../../../domain/interface/useCaseInterface/IRegisterUserUseCase';
import { ILoginUserUseCase } from '../../../domain/interface/useCaseInterface/ILoginUserUseCase';
import { IGetUsersUseCase } from '../../../domain/interface/useCaseInterface/IGetUsersUseCase';
import { IToggleUserStatusUseCase } from '../../../domain/interface/useCaseInterface/IToggleUserStatusUseCase';

export class AuthController {
  constructor(
    private readonly registerUserUseCase: IRegisterUserUseCase,
    private readonly loginUserUseCase: ILoginUserUseCase,
    private readonly getUsersUseCase: IGetUsersUseCase,
    private readonly toggleUserStatusUseCase?: IToggleUserStatusUseCase
  ) {}

  register = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const adminId = req.user?.id;
      const userResult = await this.registerUserUseCase.execute({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        adminId
      });

      return res.status(201).json({
        success: true,
        message: `User '${userResult.name}' created successfully with role '${userResult.role}'`,
        data: userResult
      });
    } catch (error) {
      return next(error);
    }
  };

  login = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const result = await this.loginUserUseCase.execute({
        email: req.body.email,
        password: req.body.password
      });

      return res.status(200).json({
        success: true,
        message: 'Authentication successful',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  };

  getUsers = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const users = await this.getUsersUseCase.execute();

      return res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users
      });
    } catch (error) {
      return next(error);
    }
  };

  toggleStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      const adminId = req.user?.id;

      if (!this.toggleUserStatusUseCase) {
        throw new Error('ToggleUserStatusUseCase is not injected');
      }

      const result = await this.toggleUserStatusUseCase.execute({
        userId: id,
        isActive: Boolean(isActive),
        adminId
      });

      return res.status(200).json({
        success: true,
        message: `User account '${result.name}' has been ${result.isActive ? 'unblocked (activated)' : 'blocked (deactivated)'}`,
        data: result
      });
    } catch (error) {
      return next(error);
    }
  };

  me = async (req: AuthenticatedRequest, res: Response) => {
    return res.status(200).json({
      success: true,
      message: 'Current user profile details',
      data: req.user
    });
  };
}
