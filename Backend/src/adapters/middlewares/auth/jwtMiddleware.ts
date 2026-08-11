import { Request, Response, NextFunction } from 'express';
import { IJwtService, JwtPayload } from '../../../domain/interface/serviceInterface/IJwtService';
import { UnauthorizedError } from '../../../shared/errors/AppError';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const createJwtMiddleware = (jwtService: IJwtService) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new UnauthorizedError('Authentication token missing or malformed'));
    }

    const token = authHeader.split(' ')[1];
    const payload = jwtService.verifyToken(token);

    if (!payload) {
      return next(new UnauthorizedError('Invalid or expired authentication token'));
    }

    req.user = payload;
    return next();
  };
};
