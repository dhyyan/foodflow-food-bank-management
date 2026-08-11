import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth/jwtMiddleware';
import { IGetLotsUseCase } from '../../../useCase/lot/GetLotsUseCase';

export class LotController {
  constructor(private readonly getLotsUseCase: IGetLotsUseCase) {}

  getLots = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { search, category, status, donationId, page, limit } = req.query;

      const result = await this.getLotsUseCase.execute({
        search: search ? String(search) : undefined,
        category: category ? String(category) : undefined,
        status: status ? String(status) : undefined,
        donationId: donationId ? String(donationId) : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined
      });

      return res.status(200).json({
        success: true,
        message: 'Lots retrieved successfully',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  };
}
