import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth/jwtMiddleware';
import { ICreateDonationUseCase } from '../../../useCase/donation/CreateDonationUseCase';
import { IGetDonationsUseCase } from '../../../useCase/donation/GetDonationsUseCase';
import { IGetDonationByIdUseCase } from '../../../useCase/donation/GetDonationByIdUseCase';
import { UnauthorizedError } from '../../../shared/errors/AppError';

export class DonationController {
  constructor(
    private readonly createDonationUseCase: ICreateDonationUseCase,
    private readonly getDonationsUseCase: IGetDonationsUseCase,
    private readonly getDonationByIdUseCase: IGetDonationByIdUseCase
  ) {}

  createDonation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User context missing from token');
      }

      const clerkId = req.user.id;
      const clerkName = req.user.name || 'Donation Clerk';

      const result = await this.createDonationUseCase.execute(
        {
          donorName: req.body.donorName,
          donorType: req.body.donorType,
          receivedAt: req.body.receivedAt,
          lines: req.body.lines,
          notes: req.body.notes
        },
        clerkId,
        clerkName
      );

      return res.status(201).json({
        success: true,
        message: `Donation intake ${result.donation.donationNumber} created successfully with ${result.lots.length} lots`,
        data: result
      });
    } catch (error) {
      return next(error);
    }
  };

  getDonations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { search, donorType, startDate, endDate, page, limit } = req.query;

      const result = await this.getDonationsUseCase.execute({
        search: search ? String(search) : undefined,
        donorType: donorType ? String(donorType) : undefined,
        startDate: startDate ? String(startDate) : undefined,
        endDate: endDate ? String(endDate) : undefined,
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined
      });

      return res.status(200).json({
        success: true,
        message: 'Donations retrieved successfully',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  };

  getDonationById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.getDonationByIdUseCase.execute(id);

      return res.status(200).json({
        success: true,
        message: 'Donation details retrieved successfully',
        data: result
      });
    } catch (error) {
      return next(error);
    }
  };
}
