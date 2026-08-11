import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../auth/jwtMiddleware';
import { ForbiddenError, UnauthorizedError } from '../../../shared/errors/AppError';
import { UserRole } from '../../../domain/entities/User';

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('User authentication context missing'));
    }

    const hasRole = allowedRoles.includes(req.user.role as UserRole);
    if (!hasRole) {
      return next(new ForbiddenError(`User role '${req.user.role}' is not authorized to access this resource`));
    }

    return next();
  };
};
