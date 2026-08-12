import { Router } from 'express';
import { authController, jwtMiddleware } from '../DI/authInject';
import { requireRole } from '../../adapters/middlewares/authorization/roleMiddleware';
import { UserRole } from '../../domain/entities/User';

const router = Router();

// Public routes
router.post('/login', authController.login);

// Protected routes (Requires valid JWT)
router.get('/me', jwtMiddleware, authController.me);

// Admin-only routes: Admin registers users with specific role and manages account status
router.post('/register', jwtMiddleware, requireRole(UserRole.ADMIN), authController.register);
router.get('/users', jwtMiddleware, requireRole(UserRole.ADMIN), authController.getUsers);
router.patch('/users/:id/status', jwtMiddleware, requireRole(UserRole.ADMIN), authController.toggleStatus);

export default router;
