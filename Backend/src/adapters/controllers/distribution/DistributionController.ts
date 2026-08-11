import { Request, Response, NextFunction } from 'express';
import { PreviewAllocationUseCase } from '../../../useCase/distribution/PreviewAllocationUseCase';
import { CreateDistributionUseCase } from '../../../useCase/distribution/CreateDistributionUseCase';
import { DistributionModel } from '../../../frameWork/database/models/DistributionModel';

export class DistributionController {
  constructor(
    private readonly previewAllocationUseCase: PreviewAllocationUseCase,
    private readonly createDistributionUseCase: CreateDistributionUseCase
  ) {}

  previewAllocation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.previewAllocationUseCase.execute(req.body);
      res.status(200).json({
        success: true,
        message: 'Distribution lot allocation preview generated successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  createDistribution = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = (req as any).user;
      const performedBy = {
        id: user.id,
        name: user.name || user.email,
        role: user.role
      };

      const result = await this.createDistributionUseCase.execute(req.body, performedBy);
      res.status(201).json({
        success: true,
        message: 'Distribution order created and stock reserved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  listDistributions = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const docs = await DistributionModel.find().sort({ createdAt: -1 });
      res.status(200).json({
        success: true,
        data: docs
      });
    } catch (error) {
      next(error);
    }
  };
}
