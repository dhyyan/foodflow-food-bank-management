"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
class AuthController {
    registerUserUseCase;
    loginUserUseCase;
    getUsersUseCase;
    constructor(registerUserUseCase, loginUserUseCase, getUsersUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
        this.getUsersUseCase = getUsersUseCase;
    }
    register = async (req, res, next) => {
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
        }
        catch (error) {
            return next(error);
        }
    };
    login = async (req, res, next) => {
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
        }
        catch (error) {
            return next(error);
        }
    };
    getUsers = async (_req, res, next) => {
        try {
            const users = await this.getUsersUseCase.execute();
            return res.status(200).json({
                success: true,
                message: 'Users retrieved successfully',
                data: users
            });
        }
        catch (error) {
            return next(error);
        }
    };
    me = async (req, res) => {
        return res.status(200).json({
            success: true,
            message: 'Current user profile details',
            data: req.user
        });
    };
}
exports.AuthController = AuthController;
